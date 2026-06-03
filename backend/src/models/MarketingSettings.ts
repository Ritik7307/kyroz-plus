import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketingSettings extends Document {
  userId: mongoose.Types.ObjectId;
  vipThreshold: number;
  highSpendingThreshold: number;
  whatsappConnected: boolean;
  businessAccountId?: string;
  phoneNumberId?: string;
  accessToken?: string;
  businessName?: string;
  businessPhone?: string;
  lastSynced?: Date;
  automationSettings: {
    orderConfirmation: boolean;
    paymentConfirmation: boolean;
    orderReady: boolean;
    deliveryUpdates: boolean;
    reservationConfirmation: boolean;
    reservationReminder: boolean;
    reservationCancellation: boolean;
    feedbackRequests: boolean;
    loyaltyReward: boolean;
    birthdayWishes: boolean;
    vipOffers: boolean;
    promotionalBroadcasts: boolean;
    festivalOffers: boolean;
    weekendDiscounts: boolean;
    newMenuLaunch: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MarketingSettingsSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    vipThreshold: { type: Number, default: 5000 },
    highSpendingThreshold: { type: Number, default: 1000 },
    whatsappConnected: { type: Boolean, default: false },
    businessAccountId: { type: String },
    phoneNumberId: { type: String },
    accessToken: { type: String },
    businessName: { type: String },
    businessPhone: { type: String },
    lastSynced: { type: Date },
    automationSettings: {
      orderConfirmation: { type: Boolean, default: false },
      paymentConfirmation: { type: Boolean, default: false },
      orderReady: { type: Boolean, default: false },
      deliveryUpdates: { type: Boolean, default: false },
      reservationConfirmation: { type: Boolean, default: false },
      reservationReminder: { type: Boolean, default: false },
      reservationCancellation: { type: Boolean, default: false },
      feedbackRequests: { type: Boolean, default: false },
      loyaltyReward: { type: Boolean, default: false },
      birthdayWishes: { type: Boolean, default: false },
      vipOffers: { type: Boolean, default: false },
      promotionalBroadcasts: { type: Boolean, default: false },
      festivalOffers: { type: Boolean, default: false },
      weekendDiscounts: { type: Boolean, default: false },
      newMenuLaunch: { type: Boolean, default: false },
    }
  },
  { timestamps: true }
);

export default mongoose.models.MarketingSettings || mongoose.model<IMarketingSettings>('MarketingSettings', MarketingSettingsSchema);
