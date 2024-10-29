import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDeal extends Document {
  getUpdate: any;
  deal_name: string;
  stage: 'new' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';
  deal_value: number;
  expected_close_date: Date;
  close_probability: number;
  forecast_value: number;
  org_id: Types.ObjectId;
}
 
const DealSchema: Schema = new Schema(
  {
    deal_name: { type: String, required: true },
    stage: {
      type: String,
      enum: ['new', 'discovery', 'proposal', 'negotiation', 'won', 'lost'],
      default: 'new',
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
    forecast_value: { type: Number },
    org_id: {type: Schema.Types.ObjectId, ref: 'Organization', required: true}

  },
  { timestamps: true, versionKey: false }
);

// Pre-save hook to calculate forecast_value
DealSchema.pre<IDeal>('save', function (next) {
  this.forecast_value = (this.deal_value * this.close_probability) / 100;
  next();
});

// Pre-update hook for both findOneAndUpdate and updateOne
DealSchema.pre<IDeal>('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  // Check if either deal_value or close_probability is being updated
  if (update.deal_value !== undefined || update.close_probability !== undefined) {
    const dealValue = update.deal_value !== undefined ? update.deal_value : this.getUpdate().deal_value;
    const closeProbability = update.close_probability !== undefined ? update.close_probability : this.getUpdate().close_probability;

    // Calculate forecast_value if either field is being updated
    if (dealValue !== undefined && closeProbability !== undefined) {
      update.forecast_value = (dealValue * closeProbability) / 100;
    }
  }

  next();
});



export const Deal = mongoose.model<IDeal>('Deal', DealSchema);
