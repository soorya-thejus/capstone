import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAccount extends Document {
  account_name: string;
  priority: 'high' | 'medium' | 'low';
  industry: string;
  description: string;
  number_of_employees: number;
  org_id: Types.ObjectId;
  created_by: Types.ObjectId;
}

const AccountSchema: Schema = new Schema({
  account_name: { type: String, required: true },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true,
  },
  industry: { type: String, required: true },
  description: { type: String, required: false },  // Text type in MongoDB is equivalent to String in Mongoose
  number_of_employees: { type: Number, required: true },
  org_id: {type: Schema.Types.ObjectId, ref: 'Organization', required: true},
  created_by: { type: Types.ObjectId, ref: 'User', required: true },


}, { timestamps: true, versionKey: false });

export const Account =  mongoose.model<IAccount>('Account', AccountSchema);
