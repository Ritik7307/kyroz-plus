import mongoose, { Document, Schema } from 'mongoose';

export interface ISyncHistory extends Document {
  operation_id: string;
  createdAt: Date;
}

const SyncHistorySchema: Schema = new Schema({
  operation_id: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Automatically delete history after 30 days
});

export default mongoose.models.SyncHistory || mongoose.model<ISyncHistory>('SyncHistory', SyncHistorySchema);
