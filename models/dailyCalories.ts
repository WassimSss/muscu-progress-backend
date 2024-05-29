import { Schema, model, Document } from 'mongoose';

interface IDailyCalorie extends Document {
  user: Schema.Types.ObjectId;
  calories: number;
  date: Date;
}

const dailyCalorieSchema = new Schema<IDailyCalorie>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  calories: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export const DailyCalorie = model<IDailyCalorie>('DailyCalorie', dailyCalorieSchema);
