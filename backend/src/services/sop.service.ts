import mongoose from 'mongoose';
import Sop from '../models/Sop';
import MasterSop from '../models/MasterSop';

export const syncMasterSopsForUser = async (userId: string | mongoose.Types.ObjectId) => {
  try {
    const masterSops = await MasterSop.find();
    for (const sopData of masterSops) {
      await Sop.findOneAndUpdate(
        { title: sopData.title, userId },
        { 
          title: sopData.title,
          category: sopData.category,
          contentEn: sopData.contentEn,
          contentHi: sopData.contentHi,
          content: sopData.content,
          userId 
        },
        { upsert: true, new: true }
      );
    }
    console.log(`Synced ${masterSops.length} master SOPs for user ${userId}`);
  } catch (error) {
    console.error('Master SOP sync failed:', error);
  }
};
