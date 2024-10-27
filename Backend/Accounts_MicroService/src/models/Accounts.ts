import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  account_name: string;
  priority: 'high' | 'medium' | 'low';
  industry: string;
  description: string;
  number_of_employees: number;
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
}, { timestamps: true, versionKey: false });

export const Account =  mongoose.model<IAccount>('Account', AccountSchema);