// models/Metrics.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

interface IMetric extends Document {
  timestamp: Date; // Last updated time
  active_deals_forecast_value: number;
  average_won_deal_value: number;
  actual_revenue: number;
  total_deals: number;
  won_deals: number;
  lost_deals: number;
  new_deals: number;
  discovery_deals: number;
  proposal_deals: number;
  nego_deals: number;
  deal_status_distribution: Record<string, number>;
  actual_revenue_by_month: Record<string, number>;
  pipeline_conversion: Record<string, number>;
  forecasted_revenue_by_month: Record<string, number>;
  forecasted_revenue_by_stage: Record<string, number>;
  org_id: Types.ObjectId;
}



// Define the schema
const MetricsSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now }, // Track last updated time
  active_deals_forecast_value: { type: Number, default: 0 }, // Total forecasted value for active deals
  average_won_deal_value: { type: Number, default: 0 }, // Average value of won deals
  actual_revenue: { type: Number, default: 0 }, // Actual revenue generated from won deals
  total_deals: { type: Number, default: 0 }, // Total number of deals processed
  won_deals: {type: Number, deafult: 0},
  lost_deals: {type: Number, deafult: 0},
  new_deals: {type: Number, deafult: 0},
  discovery_deals:{type: Number, deafult: 0},
  proposal_deals: {type: Number, deafult: 0},
  nego_deals: {type: Number, deafult: 0},
  deal_status_distribution: {
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    discovery: { type: Number, default: 0 },
    proposal: { type: Number, default: 0 },
    negotiation: { type: Number, default: 0 },
  }, // Track deal counts by status
  actual_revenue_by_month: { type: Map, of: Number, default: {} }, // Revenue by month
  pipeline_conversion: {
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    discovery: { type: Number, default: 0 },
    proposal: { type: Number, default: 0 },
    negotiation: { type: Number, default: 0 },
  }, // Deals in pipeline stages
  forecasted_revenue_by_month: { type: Map, of: Number, default: {} }, // Forecasted revenue by month
  forecasted_revenue_by_stage: {
    // won: { type: Number, default: 0 },
    // lost: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    discovery: { type: Number, default: 0 },
    proposal: { type: Number, default: 0 },
    negotiation: { type: Number, default: 0 },
  }, // Forecasted revenue by deal stage
  org_id: {type: Schema.Types.ObjectId, ref: 'Organization', required: true},
});




export const Metrics = mongoose.model<IMetric>('Metrics', MetricsSchema);
