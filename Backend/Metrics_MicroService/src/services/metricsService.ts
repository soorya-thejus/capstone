// services/metricsService.ts
import { Metrics } from '../models/Metrics';
import axios from 'axios';

async function fetchDeals() {
  // Fetch all deals from the Deals microservice
  const response = await axios.get('http://localhost:5002/api/deals');
  return response.data;
}

export async function updateDashboardMetrics(): Promise<void> {
  const deals = await fetchDeals();
  const metrics = {
    active_deals_forecast_value: 0,
    average_won_deal_value: 0,
    actual_revenue: 0,
    deal_status_distribution: {} as Record<string, number>,
    actual_revenue_by_month: {} as Record<string, number>,
    pipeline_conversion: {} as Record<string, number>,
    forecasted_revenue_by_month: {} as Record<string, number>,
    forecasted_revenue_by_stage: {} as Record<string, number>,
  };

  let wonDeals = 0;
  let wonDealSum = 0;

  deals.forEach((deal: any) => {
    // Active deals (not won/lost)
    if (deal.stage !== 'won' && deal.stage !== 'lost') {
      metrics.active_deals_forecast_value += deal.forecast_value;
      metrics.forecasted_revenue_by_stage[deal.stage] = (metrics.forecasted_revenue_by_stage[deal.stage] || 0) + deal.forecast_value;
    }

    // Won deals
    if (deal.stage === 'won') {
      metrics.actual_revenue += deal.deal_value;
      wonDealSum += deal.deal_value;
      wonDeals++;
      const month = new Date(deal.close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
      metrics.actual_revenue_by_month[month] = (metrics.actual_revenue_by_month[month] || 0) + deal.deal_value;
    }

    // Deal Status Distribution and Pipeline Conversion
    metrics.deal_status_distribution[deal.stage] = (metrics.deal_status_distribution[deal.stage] || 0) + 1;
    metrics.pipeline_conversion[deal.stage] = (metrics.pipeline_conversion[deal.stage] || 0) + 1;

    // Forecasted revenue by month for active deals
    if (deal.stage !== 'won' && deal.stage !== 'lost') {
      const month = new Date(deal.expected_close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
      metrics.forecasted_revenue_by_month[month] = (metrics.forecasted_revenue_by_month[month] || 0) + deal.forecast_value;
    }
  });

  // Calculate average won deal value
  metrics.average_won_deal_value = wonDeals > 0 ? wonDealSum / wonDeals : 0;

  // Save or update the metrics in MongoDB
  await Metrics.findOneAndUpdate({}, { ...metrics, timestamp: new Date() }, { upsert: true });
}
