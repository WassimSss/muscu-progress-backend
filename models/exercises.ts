import { Schema, model, Document } from 'mongoose';

interface IExercise extends Document {
  user: Schema.Types.ObjectId;
  name: string;
  sets: {
    weight: number;
    repetitions: number;
  }[];
  date: Date;
}

const exerciseSchema = new Schema<IExercise>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  sets: [{
    weight: { type: Number },
    repetitions: { type: Number }
  }],
  date: { type: Date, default: Date.now }
});

export const Exercise = model<IExercise>('Exercise', exerciseSchema);
