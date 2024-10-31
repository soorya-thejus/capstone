// metricsMicroservice/services/metricsService.ts
import { Metrics } from '../models/Metrics';

export const updateMetricsFromDealEvent = async (dealData: any): Promise<void> => {
  const { deal_value, forecast_value, stage, close_date, expected_close_date } = dealData;

  // Fetch current metrics from the database
  const metrics = await Metrics.findOne({}) || new Metrics();

  // Reset or update metrics based on the deal stage
  if (stage === 'won') {
    // Add deal value to actual revenue
    metrics.actual_revenue += deal_value;

    // Add to actual revenue by month
    const month = new Date(close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    metrics.actual_revenue_by_month[month] = 
      (metrics.actual_revenue_by_month[month] || 0) + deal_value;

    // Track won deal counts and values
    metrics.deal_status_distribution[stage] = 
      (metrics.deal_status_distribution[stage] || 0) + 1;
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

  // Update pipeline and deal status distribution for all stages
  metrics.pipeline_conversion[stage] = 
    (metrics.pipeline_conversion[stage] || 0) + 1;

  // Save the updated metrics document
  await metrics.save();
};
