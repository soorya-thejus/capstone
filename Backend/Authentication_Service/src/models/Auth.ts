import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
    org_id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: 'Admin' | 'Sales Rep';
}

const userSchema: Schema = new Schema({
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization' },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String
        , enum: ['Admin', 'Sales Rep']
        ,default: "Admin"
        , required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;