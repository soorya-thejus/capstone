import mongoose, { Document, Schema, Types } from 'mongoose';



export interface IOrganization extends Document {
  name: string;
  type: string;
  address: string;
  contact_info: string;
  adminId: Types.ObjectId;
}

const OrganizationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true,index: true,},
    type: { type: String, required: true },
    address: { type: String, required: true },
    contact_info: { type: String, required: true },
    adminId: { type: Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true, versionKey: false }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
