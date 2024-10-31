// metricsMicroservice/services/metricsService.ts
import { Metrics } from '../models/Metrics';
export const updateMetricsFromDealEvent = async (dealData: any): Promise<void> => {
  const { deal_value, forecast_value, stage, expected_close_date } = dealData;

  // Fetch current metrics from the database or initialize a new metrics object
  const metrics = await Metrics.findOne({}) || new Metrics();

  // Total deals 
  metrics.total_deals = (metrics.total_deals || 0) + 1;

  // Reset or update metrics based on the deal stage
  if (stage === 'won') {

    // Add deal value to actual revenue
    metrics.actual_revenue += deal_value;

    //Total won deals
    metrics.won_deals = (metrics.won_deals || 0) + 1;

    metrics.average_won_deal_value = metrics.deal_status_distribution.won > 0
      ? metrics.actual_revenue / metrics.deal_status_distribution.won
      : 0;

    // Add to actual revenue by month
    const closeDate = new Date(expected_close_date);
    const month = closeDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    metrics.actual_revenue_by_month[month] = 
      (metrics.actual_revenue_by_month[month] || 0) + deal_value;

    // Track won deal counts

  } 
  else if(stage === 'new'){

  }
  else if(stage === 'discovery'){

  }
  else if(stage === ''){

  }
  
  
  else if (stage !== 'lost') {
    // For active deals (not won or lost), add to forecasted values
    metrics.active_deals_forecast_value += forecast_value;

    // Track forecasted revenue by stage
    metrics.forecasted_revenue_by_stage[stage] = 
      (metrics.forecasted_revenue_by_stage[stage] || 0) + forecast_value;

    // Forecasted revenue by month for active deals
    const month = new Date(expected_close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    metrics.forecasted_revenue_by_month[month] = 
      (metrics.forecasted_revenue_by_month[month] || 0) + forecast_value;
  }

  metrics.deal_status_distribution[stage] = 
      (metrics.deal_status_distribution[stage] || 0) + 1;

  // Update pipeline and deal status distribution for all stages
  metrics.pipeline_conversion[stage] = 
    (metrics.pipeline_conversion[stage] || 0) + 1;

  

  // Calculate deal status distribution percentage
  for (const key of Object.keys(metrics.deal_status_distribution)) {
    metrics.deal_status_distribution[key] = 
      ((metrics.deal_status_distribution[key] || 0) / metrics.total_deals) * 100 || 0;
  }

  // Save the updated metrics document
  await metrics.save();
};
