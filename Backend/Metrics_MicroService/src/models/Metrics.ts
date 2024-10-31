// models/Metrics.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IMetric extends Document {
  timestamp: Date; // Last updated time
  active_deals_forecast_value: number;
  average_won_deal_value: number;
  actual_revenue: number;
  deal_status_distribution: Record<string, number>;
  actual_revenue_by_month: Record<string, number>;
  pipeline_conversion: Record<string, number>;
  forecasted_revenue_by_month: Record<string, number>;
  forecasted_revenue_by_stage: Record<string, number>;
}

const MetricsSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now },
  active_deals_forecast_value: { type: Number, default: 0 },
  average_won_deal_value: { type: Number, default: 0 },
  actual_revenue: { type: Number, default: 0 },
  deal_status_distribution: { type: Map, of: Number, default: {} },
  actual_revenue_by_month: { type: Map, of: Number, default: {} },
  pipeline_conversion: { type: Map, of: Number, default: {} },
  forecasted_revenue_by_month: { type: Map, of: Number, default: {} },
  forecasted_revenue_by_stage: { type: Map, of: Number, default: {} },
});

export const Metrics = mongoose.model<IMetric>('Metrics', MetricsSchema);
