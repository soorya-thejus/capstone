import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the interface for the Lead document
export interface ILead extends Document {
  getQuery: any;
  getUpdate: any;
  type: 'create' | 'update';
  lead_name: string;
  status: 'new lead' | 'attempted to contact' | 'contacted' | 'qualified' | 'unqualified';
  temp_status: string;
  previous_status: string;
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
  temp_status: {
    type: String,
    required: false,
  },
  previous_status: {
    type: String,
    required: false,
  },
  company: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  org_id: {type: Schema.Types.ObjectId, ref: 'Organization', required: true},
  owner_id: { type: Types.ObjectId, ref: 'User', required: true },

}, {timestamps: true, versionKey: false });


LeadSchema.pre<ILead>('save', async function (next) {
  try {

    

    this.temp_status = this.status;
    this.previous_status = "";

    

    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('An unexpected error occurred'));
  }
});

LeadSchema.pre<ILead>('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  
  const LeadModel = mongoose.model<ILead>('Lead'); 
  const currentLead = await LeadModel.findOne(this.getQuery());

  if (currentLead) {
    update.previous_status = currentLead.temp_status;

    if (update.status !== undefined) {
      update.temp_status = update.status;
    }
  }

  update.type = "update"; 

  next();
});

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
