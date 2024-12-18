import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProject extends Document {
  project_name: string;
  priority: 'high' | 'medium' | 'low';
  start_date: Date;
  end_date: Date;
  status: 'not started' | 'working on it' | 'stuck' | 'done';
  contact_id: Types.ObjectId;
  org_id: Types.ObjectId;
  owner_id: Types.ObjectId;
  rep_id: Types.ObjectId;

}
 
const ProjectSchema: Schema = new Schema({
  project_name: { type: String, required: true },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true,
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['not started', 'working on it', 'stuck', 'done'],
    default: 'not started',
    required: true,
  },
  contact_id: {type: Schema.Types.ObjectId, ref: 'Contact', required: true},
  org_id: {type: Schema.Types.ObjectId, ref: 'Organization', required: true},
  owner_id: { type: Types.ObjectId, ref: 'User', required: true },
  rep_id: { type: Types.ObjectId, ref: 'User', required: false },

}, { timestamps: true, versionKey: false });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
