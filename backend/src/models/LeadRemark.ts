import mongoose, { Document, Schema } from 'mongoose';

export interface ILeadRemark extends Document {
  phone: string;
  remark: string;
  syncedAt: Date;
}

const LeadRemarkSchema: Schema = new Schema({
  phone: { type: String, required: true },
  remark: { type: String, required: true },
  syncedAt: { type: Date, default: Date.now }
});

// Compound index to ensure we don't process the exact same remark twice for the same phone number
LeadRemarkSchema.index({ phone: 1, remark: 1 }, { unique: true });

export default mongoose.model<ILeadRemark>('LeadRemark', LeadRemarkSchema);
