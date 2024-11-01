// metricsMicroservice/services/metricsService.ts
import { Metrics } from '../models/Metrics';

export const updateMetricsFromDealEvent = async (dealData: any): Promise<void> => {
  const { deal_value, forecast_value, stage, expected_close_date, org_id } = dealData;

  // Fetch current metrics for the specified org_id or initialize a new metrics object for the organization
  let metrics = await Metrics.findOne({ org_id });
  if (!metrics) {
    metrics = new Metrics({ org_id }); // Initialize with org_id if not found
  }

  // Update total deals count for the organization
  metrics.total_deals = (metrics.total_deals || 0) + 1;

  // Reset or update metrics based on the deal stage
  if (stage === 'won') {
    // Add deal value to actual revenue
    metrics.actual_revenue = (metrics.actual_revenue || 0) + deal_value;

    // Total won deals
    metrics.won_deals = (metrics.won_deals || 0) + 1;

    // Calculate average won deal value
    metrics.average_won_deal_value = metrics.won_deals > 0 ? metrics.actual_revenue / metrics.won_deals : 0;

    // Add to actual revenue by month
    const closeDate = new Date(expected_close_date);
    const month = closeDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    metrics.actual_revenue_by_month[month] = 
      (metrics.actual_revenue_by_month[month] || 0) + deal_value;
  } 
  
  else if (stage !== 'lost') {
    // Track deal stage counts for active deals
    if(stage === 'new'){
      metrics.new_deals = (metrics.new_deals || 0) + 1;
    }
    else if(stage === 'discovery'){
      metrics.discovery_deals = (metrics.discovery_deals || 0) + 1;
    }
    else if(stage === 'proposal'){
      metrics.proposal_deals = (metrics.proposal_deals || 0) + 1;
    }
    else if(stage === 'negotiation'){
      metrics.nego_deals = (metrics.nego_deals || 0) + 1;
    }

    // For active deals (not won or lost), add to forecasted values
    metrics.active_deals_forecast_value = (metrics.active_deals_forecast_value || 0) + forecast_value;

    // Track forecasted revenue by stage
    metrics.forecasted_revenue_by_stage[stage] = 
    (metrics.forecasted_revenue_by_stage[stage] || 0) + forecast_value;

    // Forecasted revenue by month for active deals
    const month = new Date(expected_close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    metrics.forecasted_revenue_by_month[month] = 
      (metrics.forecasted_revenue_by_month[month] || 0) + forecast_value;
  }

  

  // Update pipeline conversion and deal status distribution for each stage
  metrics.pipeline_conversion[stage] = 
    (metrics.pipeline_conversion[stage] || 0) + 1;

  // Calculate deal status distribution percentage for each stage
    metrics.deal_status_distribution.new = ((metrics.new_deals||0) / metrics.total_deals) * 100;

    metrics.deal_status_distribution.discovery = ((metrics.discovery_deals||0 )/ metrics.total_deals) * 100;

    metrics.deal_status_distribution.proposal = ((metrics.proposal_deals||0) / metrics.total_deals) * 100;

    metrics.deal_status_distribution.negotiation = ((metrics.nego_deals||0 )/ metrics.total_deals) * 100;

    metrics.deal_status_distribution.won = ((metrics.won_deals||0) / metrics.total_deals) * 100;

    metrics.deal_status_distribution.lost = ((metrics.lost_deals||0) / metrics.total_deals) * 100;

    

  // Save the updated metrics document
  await metrics.save();
};