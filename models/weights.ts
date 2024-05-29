import { Schema, model, Document } from 'mongoose';

interface IWeight extends Document {
  user: Schema.Types.ObjectId;
  weight: number;
  date: Date;
}

const weightSchema = new Schema<IWeight>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export const Weight = model<IWeight>('Weight', weightSchema);