import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the interface for the Lead document
export interface ILead extends Document {
  getUpdate: any;
  type: 'create' | 'update';
  lead_name: string;
  status: 'new lead' | 'attempted to contact' | 'contacted' | 'qualified' | 'unqualified';
  company: string;
  title: string;
  email: string;
  phone: string;
  org_id: Types.ObjectId;
  owner_id: Types.ObjectId;
}


// Define the Lead schema
const LeadSchema: Schema = new Schema({
  type: { type: String, enum: ['create', 'update'], default: 'create', required: false },
  lead_name: { type: String, required: true },
  status: {
    type: String,
    enum: ['new lead', 'attempted to contact', 'contacted', 'qualified', 'unqualified'],
    default: 'new lead', // Set default status to 'new lead'
    required: true,
  },
  company: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  org_id: {type: Schema.Types.ObjectId, ref: 'Organization', required: true},
  owner_id: { type: Types.ObjectId, ref: 'User', required: true },

}, {timestamps: true, versionKey: false });



LeadSchema.pre<ILead>('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();  

  update.type = "update"; 

  next();
});

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
