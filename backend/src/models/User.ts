import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    avatar?: string;
    role: 'citizen' | 'admin';
    sitesTracked: number;
    feedbackGiven: number;
    zonesEntered: number;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String },
    city: { type: String, default: 'India' },
    avatar: { type: String },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
    sitesTracked: { type: Number, default: 0 },
    feedbackGiven: { type: Number, default: 0 },
    zonesEntered: { type: Number, default: 0 },
}, { timestamps: true });

// Hash password before save (Mongoose v9: async pre-hooks don't use next)
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
});



// Compare passwords
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
