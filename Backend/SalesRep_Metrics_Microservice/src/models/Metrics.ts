// models/Metrics.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

interface IMetric extends Document {
  timestamp: Date; // Last updated time
  active_deals_forecast_value: number;
  average_won_deal_value: number;
  actual_revenue: number;
  total_deals: number;
  total_leads: number;
  qualified_leads: number;
  lead_conversion_rate: number;
  won_deals: number;
  lost_deals: number;
  new_deals: number;
  discovery_deals: number;
  proposal_deals: number;
  nego_deals: number;
  commission: number;
  deal_status_distribution: Record<string, number>;
  actual_revenue_by_month: Record<string, number>;
  pipeline_conversion: Record<string, number>;
  forecasted_revenue_by_month: Record<string, number>;
  forecasted_revenue_by_stage: Record<string, number>;
  org_id: Types.ObjectId;
  owner_id: Types.ObjectId;
}



// Define the schema
const MetricsSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now }, 
  active_deals_forecast_value: { type: Number, default: 0 },
  average_won_deal_value: { type: Number, default: 0 }, 
  actual_revenue: { type: Number, default: 0 }, 
  total_deals: { type: Number, default: 0 }, 
  total_leads: { type: Number, default: 0 },
  qualified_leads: { type: Number, default: 0 },
  lead_conversion_rate: { type: Number, default: 0 },
  won_deals: {type: Number, default: 0},
  lost_deals: {type: Number, default: 0},
  new_deals: {type: Number, default: 0},
  discovery_deals:{type: Number, default: 0},
  proposal_deals: {type: Number, default: 0},
  nego_deals: {type: Number, default: 0},
  commission: {type: Number, default: 0},
  deal_status_distribution: {
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    discovery: { type: Number, default: 0 },
    proposal: { type: Number, default: 0 },
    negotiation: { type: Number, default: 0 },
  }, // Track deal counts by status
  actual_revenue_by_month: { 
    Jan: {type: Number, default: 0 },
    Feb: {type: Number, default: 0 },
    Mar: {type: Number, default: 0 },
    Apr: {type: Number, default: 0 },
    May: {type: Number, default: 0 },
    Jun: {type: Number, default: 0 },
    Jul: {type: Number, default: 0 },
    Aug: {type: Number, default: 0 },
    Sep: {type: Number, default: 0 },
    Oct: {type: Number, default: 0 },
    Nov: {type: Number, default: 0 },
    Dec: {type: Number, default: 0 },
  }, // Revenue by month
  pipeline_conversion: {
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    discovery: { type: Number, default: 0 },
    proposal: { type: Number, default: 0 },
    negotiation: { type: Number, default: 0 },
  }, // Deals in pipeline stages
  forecasted_revenue_by_month: { 
    Jan: {type: Number, default: 0 },
    Feb: {type: Number, default: 0 },
    Mar: {type: Number, default: 0 },
    Apr: {type: Number, default: 0 },
    May: {type: Number, default: 0 },
    Jun: {type: Number, default: 0 },
    Jul: {type: Number, default: 0 },
    Aug: {type: Number, default: 0 },
    Sep: {type: Number, default: 0 },
    Oct: {type: Number, default: 0 },
    Nov: {type: Number, default: 0 },
    Dec: {type: Number, default: 0 },
   }, // Forecasted revenue by month
  forecasted_revenue_by_stage: {
    // won: { type: Number, default: 0 },
    // lost: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    discovery: { type: Number, default: 0 },
    proposal: { type: Number, default: 0 },
    negotiation: { type: Number, default: 0 },
  }, // Forecasted revenue by deal stage
  org_id: {type: Schema.Types.ObjectId, ref: 'Organization', required: true},
  owner_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
});




export const Metrics = mongoose.model<IMetric>('Metrics', MetricsSchema);
