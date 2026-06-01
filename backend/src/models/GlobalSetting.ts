import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalSetting extends Document {
  key: string;
  value: any;
  updatedAt: Date;
}

const GlobalSettingSchema: Schema = new Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true 
  },
  value: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IGlobalSetting>('GlobalSetting', GlobalSettingSchema);
