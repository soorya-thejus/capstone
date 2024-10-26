import mongoose, { Document, Schema } from 'mongoose';

export interface IDeal extends Document {
  deal_name: string;
  stage: 'new' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';
  deal_value: number;
  expected_close_date: Date;
  close_probability: number;
  forecast_value: number;
}

const DealSchema: Schema = new Schema({
  deal_name: { type: String, required: true },
  stage: {
    type: String,
    enum: ['new', 'discovery', 'proposal', 'negotiation', 'won', 'lost'],
    required: true,
  },
  deal_value: { type: Number, required: true },
  expected_close_date: { type: Date, required: true },
  close_probability: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  forecast_value: { type: Number, required: true },}
, { timestamps: true, versionKey: false });

// Pre-save hook to calculate forecast_value
DealSchema.pre<IDeal>('save', function (next) {
  this.forecast_value = (this.deal_value * this.close_probability) / 100;
  next();
});

export const Deal =  mongoose.model<IDeal>('Deal', DealSchema);
