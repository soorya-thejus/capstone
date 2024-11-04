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


const getCloseProbability = (stage: string): number => {
  switch (stage) {
    case 'new':
      return 60;
    case 'discovery':
      return 70;
    case 'proposal':
      return 80;
    case 'negotiation':
      return 90;
    case 'won':
      return 100;
    case 'lost':
      return 0;
    default:
      return 60; 
  }
};


// Pre-save hook 
DealSchema.pre<IDeal>('save', async function (next) {
  try {

    this.close_probability = getCloseProbability(this.stage);

    this.forecast_value = (this.deal_value * this.close_probability) / 100;

    this.temp_stage = this.stage;
    this.previous_stage = "";

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

DealSchema.pre<IDeal>('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  const DealModel = mongoose.model<IDeal>('Deal'); 
  const currentDeal = await DealModel.findOne(this.getQuery());

  if (currentDeal) {
    update.previous_stage = currentDeal.temp_stage;

    if (update.stage !== undefined) {
      update.temp_stage = update.stage;

      update.close_probability = getCloseProbability(update.stage);
    }
  }

  update.type = "update"; 
  if (update.deal_value !== undefined || update.close_probability !== undefined) {
    const dealValue = update.deal_value !== undefined ? update.deal_value : currentDeal?.deal_value;
    const closeProbability = update.close_probability !== undefined ? update.close_probability : currentDeal?.close_probability;

    update.forecast_value = (dealValue * closeProbability) / 100;
  }

  next();
});

export const Deal = mongoose.model<IDeal>('Deal', DealSchema);
