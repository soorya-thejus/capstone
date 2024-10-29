import mongoose, { Document, Schema, Types, CallbackError } from 'mongoose';
import axios from 'axios';

export interface IContact extends Document {
  lead_id: Types.ObjectId;
  contact_name: string;
  account_id: Types.ObjectId; 
  deal_ids: Types.ObjectId[];
  title: string;
  email: string;
  phone: string;
  priority: 'high' | 'medium' | 'low';
  deal_value: number;
  forecast_value: number,
  project_id: Types.ObjectId;
  org_id: Types.ObjectId;
}

const ContactSchema: Schema = new Schema({
  lead_id: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
  contact_name: { type: String},
  account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: false ,default:null},
  deal_ids: [{ type: Schema.Types.ObjectId, ref: 'Deal', required: false }],
  title: { type: String},
  email: { type: String, unique: true },
  phone: { type: String},
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: "low"
  },
  deal_value: { type: Number},
  forecast_value: {type: Number},
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: false ,default:null},
  org_id: {type: Schema.Types.ObjectId, ref: 'Organization', required: true}
}, { timestamps: true, versionKey: false });



// Pre-save hook to set `contact_name` and calculate `deal_value`
ContactSchema.pre<IContact>('save', async function (next: (err?: CallbackError) => void) {
  try {
    // Fetch lead data from Leads_Microservice API
    // const leadResponse = await axios.get(`http://localhost:5001/api/leads/${this.lead_id}`);
    // if (!leadResponse.data) {
    //   throw new Error('Lead ID not found');
    // }
    // if (leadResponse.data.lead_name && leadResponse.data.title && leadResponse.data.email && leadResponse.data.phone) {
    //     this.contact_name = leadResponse.data.lead_name;
    //     this.title = leadResponse.data.title;
    //     this.email = leadResponse.data.email;
    //     this.phone = leadResponse.data.phone;
    // }

 
 



    // Calculate deal_value as the sum of deal_values from the Deal model based on deal_ids
    if (this.deal_ids && this.deal_ids.length > 0) {
      // Make a request to Deals_Microservice to fetch deal values
      const response = await axios.post(`http://localhost:5002/api/deals/values`, {
        deal_ids: this.deal_ids,
      });

      if (response.data && response.data.deals) {
        // Sum the deal values and ensure conversion from Decimal128 to Number
        const totalDealValue = response.data.deals.reduce(
          (sum: number, deal: { deal_value: string }) => sum + parseFloat(deal.deal_value),
          0
        );
        this.deal_value = totalDealValue;

        const totalForecastValue = response.data.deals.reduce(
          (sum: number, deal: { forecast_value: string }) => sum + parseFloat(deal.forecast_value),
          0
        );
        this.forecast_value = totalForecastValue;
      }
    }

    next();
  } catch (error) {
    next(error as CallbackError);  // Explicitly cast the error to CallbackError
  }
});

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
