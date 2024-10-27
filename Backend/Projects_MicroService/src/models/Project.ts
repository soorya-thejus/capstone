import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  project_name: string;
  priority: 'high' | 'medium' | 'low';
  start_date: Date;
  end_date: Date;
  status: 'not started' | 'working on it' | 'stuck' | 'done';
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
  }
}, { timestamps: true, versionKey: false });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
