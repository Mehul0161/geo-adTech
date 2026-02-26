import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    userId: string;
    projectId: string;
    projectName: string;
    title: string;
    body: string;
    timestamp: Date;
    read: boolean;
    category: string;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    projectName: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    category: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);
