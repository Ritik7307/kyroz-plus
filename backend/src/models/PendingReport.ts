import mongoose, { Document, Schema } from 'mongoose';

export interface IPendingReport extends Document {
  phone: string;
  data: any;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  executeAt: Date;
  createdAt: Date;
}

const PendingReportSchema: Schema = new Schema({
  phone: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  executeAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPendingReport>('PendingReport', PendingReportSchema);
