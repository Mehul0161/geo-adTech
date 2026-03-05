import mongoose, { Document, Schema } from 'mongoose';

export interface IIssueReport extends Document {
    userId: string;
    issueType: string;
    severity: string;
    description: string;
    location?: string;
    lat?: number;
    lng?: number;
    status: 'pending' | 'in-review' | 'resolved';
    createdAt: Date;
}

const IssueReportSchema: Schema = new Schema({
    userId: { type: String, required: true },
    issueType: { type: String, required: true },
    severity: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Critical'] },
    description: { type: String, required: true },
    location: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    status: { type: String, enum: ['pending', 'in-review', 'resolved'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IIssueReport>('IssueReport', IssueReportSchema);
