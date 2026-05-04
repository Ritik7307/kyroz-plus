import mongoose from 'mongoose';
import Sop from '../models/Sop';
import MasterSop from '../models/MasterSop';

export const syncMasterSopsForUser = async (userId: string | mongoose.Types.ObjectId) => {
  try {
    const masterSops = await MasterSop.find().lean();
    if (masterSops.length === 0) return;

    const operations = masterSops.map(sopData => ({
      updateOne: {
        filter: { title: sopData.title, userId },
        update: { 
          $set: {
            title: sopData.title,
            category: sopData.category,
            contentEn: sopData.contentEn,
            contentHi: sopData.contentHi,
            content: sopData.content,
            userId
          }
        },
        upsert: true
      }
    }));

    await Sop.bulkWrite(operations);
    console.log(`Successfully bulk-synced ${masterSops.length} master SOPs for user ${userId}`);
  } catch (error) {
    console.error('Master SOP bulk sync failed:', error);
  }
};
