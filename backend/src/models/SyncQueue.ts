import mongoose, { Document, Schema } from 'mongoose';

export interface ISyncQueue extends Document {
  operation_id: string;
  entity_type: string;
  entity_id?: string;
  operation: string; // 'CREATE', 'UPDATE', 'DELETE'
  payload: any;
  attempts: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  last_error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SyncQueueSchema: Schema = new Schema(
  {
    operation_id: { type: String, required: true, unique: true },
    entity_type: { type: String, required: true },
    entity_id: { type: String },
    operation: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    attempts: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
    last_error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ISyncQueue>('SyncQueue', SyncQueueSchema);
