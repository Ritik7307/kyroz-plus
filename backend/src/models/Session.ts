import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  deviceInfo: string;
  ipAddress: string;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deviceInfo: { type: String, required: true },
    ipAddress: { type: String, required: true },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index to automatically remove inactive sessions after 7 days (auto cleanup)
SessionSchema.index({ lastActive: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });
SessionSchema.index({ userId: 1 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
