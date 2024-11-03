import axios from 'axios';
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDeal extends Document {
  getQuery: any;
  getUpdate: any;
  type: 'create' | 'update';
  deal_name: string;
  stage: 'new' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';
  temp_stage: string;
  previous_stage: string;
  deal_value: number;
  expected_close_date: Date;
  close_probability: number;

  contact_id: Types.ObjectId;
  account_id?: Types.ObjectId;
  
  forecast_value: number;
  org_id: Types.ObjectId;
  owner_id: Types.ObjectId;
}
 
const DealSchema: Schema = new Schema(
  {
    deal_name: { type: String, required: true },
    type: { type: String, enum: ['create', 'update'], default: 'create', required: false },
    stage: {
      type: String,
      enum: ['new', 'discovery', 'proposal', 'negotiation', 'won', 'lost'],
      default: 'new',
      required: true,
    },
    temp_stage: {
      type: String,
      required: false,
    },
    previous_stage: {
      type: String,
      required: false,
    },
    deal_value: { type: Number, required: true },
    expected_close_date: { type: Date, required: true },
    close_probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    
    contact_id: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
    account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: false },
    
    forecast_value: { type: Number },
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    owner_id: { type: Types.ObjectId, ref: 'User', required: true },

  },
  { timestamps: true, versionKey: false }
);

// Pre-save hook to calculate forecast_value and initialize temp_stage
DealSchema.pre<IDeal>('save', async function (next) {
  try {
    // Calculate forecast_value
    this.forecast_value = (this.deal_value * this.close_probability) / 100;

    // Initialize temp_stage to the initial stage value
    this.temp_stage = this.stage;
    this.previous_stage = "";

    // Fetch the account_id from the Contact microservice based on contact_id
    if (this.contact_id) {
      const response = await axios.get(`http://localhost:5005/api/contacts/${this.contact_id}`);
      if (response.data && response.data.account_id) {
        this.account_id = response.data.account_id;
      } else {
        throw new Error(`No account associated with contact ID ${this.contact_id}`);
      }
    }

    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('An unexpected error occurred'));
  }
});

// Pre-update hook to handle previous_stage and temp_stage during updates
DealSchema.pre<IDeal>('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  const DealModel = mongoose.model<IDeal>('Deal'); // Explicitly get the Deal model
  const currentDeal = await DealModel.findOne(this.getQuery());

  if (currentDeal) {
    // Set previous_stage to the current temp_stage
    update.previous_stage = currentDeal.temp_stage;

    // Update temp_stage to the new stage if it’s defined in the update
    if (update.stage !== undefined) {
      update.temp_stage = update.stage;
    }
  }

  update.type = "update"; // Always set type to update on this hook

  // Calculate forecast_value if either deal_value or close_probability is updated
  if (update.deal_value !== undefined || update.close_probability !== undefined) {
    const dealValue = update.deal_value !== undefined ? update.deal_value : currentDeal?.deal_value;
    const closeProbability = update.close_probability !== undefined ? update.close_probability : currentDeal?.close_probability;

    // Calculate forecast_value
    update.forecast_value = (dealValue * closeProbability) / 100;
  }

  next();
});

export const Deal = mongoose.model<IDeal>('Deal', DealSchema);
