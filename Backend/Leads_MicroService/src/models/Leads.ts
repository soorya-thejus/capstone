import mongoose, { model, Schema } from 'mongoose';

const LeadSchema = new Schema({
  lead_name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new lead', 'attempted to contact', 'contacted', 'qualified', 'unqualified'], 
    required: true 
  },
  company: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  location: { type: String, required: true },
}, { versionKey: false });

export default model('Lead', LeadSchema);
