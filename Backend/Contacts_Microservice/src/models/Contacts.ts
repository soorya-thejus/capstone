import mongoose, { Document, Schema, Types, CallbackError } from 'mongoose';
import axios from 'axios';

export interface IContact extends Document {
  lead_id: Types.ObjectId;
  contact_name: string;
  account_ids: Types.ObjectId[];
  deal_ids: Types.ObjectId[];
  title: string;
  email: string;
  phone: string;
  priority: 'high' | 'medium' | 'low';
  deal_value: number;
  project_id: Types.ObjectId;
}

const ContactSchema: Schema = new Schema({
  lead_id: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
  contact_name: { type: String, required: true },
  account_ids: [{ type: Schema.Types.ObjectId, ref: 'Account', required: false }],
  deal_ids: [{ type: Schema.Types.ObjectId, ref: 'Deal', required: false }],
  title: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true,
  },
  deal_value: { type: Schema.Types.Decimal128, required: true },
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: false },
}, { timestamps: true, versionKey: false });

// Pre-save hook to set `contact_name` and calculate `deal_value`
ContactSchema.pre<IContact>('save', async function (next: (err?: CallbackError) => void) {
  try {
    // Fetch lead data from Leads_Microservice API
    const leadResponse = await axios.get(`http://localhost:5001/api/leads/${this.lead_id}`);
    if (leadResponse.data && leadResponse.data.lead_name) {
      this.contact_name = leadResponse.data.lead_name;
    }

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
      }
    }

    next();
  } catch (error) {
    next(error as CallbackError);  // Explicitly cast the error to CallbackError
  }
});

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
