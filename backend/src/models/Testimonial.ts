import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  userName: string;
  userRole: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    content: { type: String, required: true },
    avatarUrl: { type: String },
    rating: { type: Number, default: 5, min: 1, max: 5 }
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
