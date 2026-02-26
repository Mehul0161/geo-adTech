import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
    projectId: string;
    userId: string;
    rating: number;
    comment?: string;
    timestamp: Date;
}

const FeedbackSchema: Schema = new Schema({
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
