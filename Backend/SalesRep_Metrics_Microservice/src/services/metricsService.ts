import { Metrics } from '../models/Metrics';

export const updateSalesRepMetricsFromDealEvent = async (dealData: any): Promise<void> => {
  const { type, deal_value, forecast_value, stage, expected_close_date,org_id, owner_id, previous_stage } = dealData;

  // Fetch current metrics for the specified owner_id or initialize a new metrics object for the salesRep
  let metrics = await Metrics.findOne({ owner_id });// change it to owner_id
  if (!metrics) {
    metrics = new Metrics({ owner_id }); // Initialize with owner_id if not found
  }

  
  
  if (type === 'create') {
    // This is a new deal
    metrics.org_id=org_id;
    metrics.total_deals = (metrics.total_deals || 0) + 1; // Increment total deals

    if (stage === 'won') {
      metrics.won_deals = (metrics.won_deals || 0) + 1; // Increment won deals
      metrics.actual_revenue = (metrics.actual_revenue || 0) + deal_value; // Increment actual revenue
      metrics.average_won_deal_value = metrics.won_deals > 0 ? metrics.actual_revenue / metrics.won_deals : 0; // Calculate average won deal value

      // Add to actual revenue by month
      const closeDate = new Date(expected_close_date);
      const month = closeDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      metrics.actual_revenue_by_month[month] = (metrics.actual_revenue_by_month[month] || 0) + deal_value;
    } 
    else if (stage === 'lost') {
      metrics.lost_deals = (metrics.lost_deals || 0) + 1; // Increment lost deals
    } 
    else {
      // Track deal stage counts for active deals
      if (stage === 'new') {
        metrics.new_deals = (metrics.new_deals || 0) + 1;
      } else if (stage === 'discovery') {
        metrics.discovery_deals = (metrics.discovery_deals || 0) + 1;
      } else if (stage === 'proposal') {
        metrics.proposal_deals = (metrics.proposal_deals || 0) + 1;
      } else if (stage === 'negotiation') {
        metrics.nego_deals = (metrics.nego_deals || 0) + 1;
      }

      // For active deals (not won or lost), add to forecasted values
      metrics.active_deals_forecast_value = (metrics.active_deals_forecast_value || 0) + forecast_value;

      // Track forecasted revenue by stage
      metrics.forecasted_revenue_by_stage[stage] = (metrics.forecasted_revenue_by_stage[stage] || 0) + forecast_value;

      // Forecasted revenue by month for active deals
      const month = new Date(expected_close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
      metrics.forecasted_revenue_by_month[month] = (metrics.forecasted_revenue_by_month[month] || 0) + forecast_value;
    }


  } else if (type === 'update') {
    // This is an existing deal being updated
    if (previous_stage) {
      // Decrement the count for the previous stage
      if (previous_stage === 'new') {
        metrics.new_deals = (metrics.new_deals || 0) - 1;
      } else if (previous_stage === 'discovery') {
        metrics.discovery_deals = (metrics.discovery_deals || 0) - 1;
      } else if (previous_stage === 'proposal') {
        metrics.proposal_deals = (metrics.proposal_deals || 0) - 1;
      } else if (previous_stage === 'negotiation') {
        metrics.nego_deals = (metrics.nego_deals || 0) - 1;
      } else if (previous_stage === 'won') {
        metrics.won_deals = (metrics.won_deals || 0) - 1;
      } else if (previous_stage === 'lost') {
        metrics.lost_deals = (metrics.lost_deals || 0) - 1;
      }
    }

    if (stage === 'won') {
      metrics.won_deals = (metrics.won_deals || 0) + 1; // Increment won deals
    } 
    else if (stage === 'lost') {
      metrics.lost_deals = (metrics.lost_deals || 0) + 1; // Increment lost deals
    } 
    else {
      // Track deal stage counts for active deals
      if (stage === 'new') {
        metrics.new_deals = (metrics.new_deals || 0) + 1;
      } else if (stage === 'discovery') {
        metrics.discovery_deals = (metrics.discovery_deals || 0) + 1;
      } else if (stage === 'proposal') {
        metrics.proposal_deals = (metrics.proposal_deals || 0) + 1;
      } else if (stage === 'negotiation') {
        metrics.nego_deals = (metrics.nego_deals || 0) + 1;
      }
    }

  }

  // Update pipeline conversion and deal status distribution for each stage
  metrics.pipeline_conversion.new = metrics.new_deals||0;
  metrics.pipeline_conversion.discovery = metrics.discovery_deals||0;
  metrics.pipeline_conversion.proposal = metrics.proposal_deals||0;
  metrics.pipeline_conversion.negotiation = metrics.nego_deals||0;
  metrics.pipeline_conversion.won = metrics.won_deals||0;
  metrics.pipeline_conversion.lost = metrics.lost_deals||0;
  

  // Calculate deal status distribution percentage for each stage
  metrics.deal_status_distribution.new = metrics.total_deals > 0 ? ((metrics.new_deals || 0) / metrics.total_deals) * 100 : 0;
  metrics.deal_status_distribution.discovery = metrics.total_deals > 0 ? ((metrics.discovery_deals || 0) / metrics.total_deals) * 100 : 0;
  metrics.deal_status_distribution.proposal = metrics.total_deals > 0 ? ((metrics.proposal_deals || 0) / metrics.total_deals) * 100 : 0;
  metrics.deal_status_distribution.negotiation = metrics.total_deals > 0 ? ((metrics.nego_deals || 0) / metrics.total_deals) * 100 : 0;
  metrics.deal_status_distribution.won = metrics.total_deals > 0 ? ((metrics.won_deals || 0) / metrics.total_deals) * 100 : 0;
  metrics.deal_status_distribution.lost = metrics.total_deals > 0 ? ((metrics.lost_deals || 0) / metrics.total_deals) * 100 : 0;

  // Save the updated metrics document
  await metrics.save();
};





