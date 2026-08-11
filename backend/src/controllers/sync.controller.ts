import { Request, Response } from 'express';
import Kot from '../models/Kot';
import mongoose from 'mongoose';

export const pushKots = async (req: Request, res: Response): Promise<void> => {
  try {
    // We assume the user ID is passed via auth middleware or body for this example
    const userId = req.user?.id || req.body.userId; 
    if (!userId) {
       res.status(401).json({ message: 'Unauthorized' });
       return;
    }

    const changes = req.body; 
    
    // Process each document from RxDB
    for (const change of changes) {
      const doc = change.newDocumentState;
      if (!doc) continue;

      let id = doc.id;
      // If it's not a valid object id, it's a temp id from the frontend. We shouldn't upsert directly on _id unless it's valid.
      // For simplicity here, assuming frontend generates valid ObjectIds or we map it.
      
      const updateData = {
          kotNumber: doc.kotNumber,
          tableNumber: doc.tableNumber,
          orderType: doc.orderType,
          customerName: doc.customerName,
          customerPhone: doc.customerPhone,
          items: doc.items,
          status: doc.status,
          updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
          deleted: doc.deleted || false
      };

      if (mongoose.Types.ObjectId.isValid(id)) {
        await Kot.findOneAndUpdate(
          { _id: id, userId },
          updateData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } else {
        // Create new
        const newKot = new Kot({ ...updateData, userId });
        await newKot.save();
      }
    }
    
    // For RxDB replication, return empty array if no conflicts
    res.status(200).json([]);
  } catch (error) {
    console.error('Error pushing KOTs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const pullKots = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
       res.status(401).json({ message: 'Unauthorized' });
       return;
    }

    const minTimestamp = req.query.minTimestamp ? parseInt(req.query.minTimestamp as string, 10) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;

    const documents = await Kot.find({
      userId,
      updatedAt: { $gt: new Date(minTimestamp) }
    })
    .sort({ updatedAt: 1 })
    .limit(limit);

    const formattedDocs = documents.map(doc => ({
      id: doc._id.toString(),
      kotNumber: doc.kotNumber,
      tableNumber: doc.tableNumber,
      orderType: doc.orderType,
      customerName: doc.customerName,
      customerPhone: doc.customerPhone,
      items: doc.items.map((i: any) => ({ dishId: i.dishId.toString(), quantity: i.quantity, note: i.note })),
      status: doc.status,
      updatedAt: doc.updatedAt.getTime(),
      deleted: doc.deleted
    }));

    const lastDoc = formattedDocs[formattedDocs.length - 1];
    const checkpoint = lastDoc ? { updatedAt: lastDoc.updatedAt, id: lastDoc.id } : null;

    res.json({
      documents: formattedDocs,
      checkpoint: checkpoint || req.query.checkpoint,
    });
  } catch (error) {
    console.error('Error pulling KOTs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
