import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  type: string;
  address: string;
  contact_info: string;
}

const OrganizationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    contact_info: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
