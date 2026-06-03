import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  dishId: mongoose.Types.ObjectId;
  platesPerPacket: number;
  totalPlates: number; // currentPackets * platesPerPacket
  lowStockThreshold: number; // In packets
  userId: mongoose.Types.ObjectId;
  lastNotified: Date;
  baseUnitName: string;
  subUnitName: string;
}

const InventorySchema: Schema = new Schema({
  dishId: { type: Schema.Types.ObjectId, ref: 'Dish', required: true },
  platesPerPacket: { type: Number, required: true, default: 10 },
  totalPlates: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lastNotified: { type: Date },
  baseUnitName: { type: String, default: 'Packet' },
  subUnitName: { type: String, default: 'Plate' }
});

// Virtual for remaining packets
InventorySchema.virtual('remainingPackets').get(function(this: IInventory) {
  return Math.floor(this.totalPlates / this.platesPerPacket);
});

export default mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema);
