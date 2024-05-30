import { Schema, model, Document } from 'mongoose';

interface IExercise extends Document {
  muscleGroup: Schema.Types.ObjectId;
  name: string;
}

const exerciseSchema = new Schema<IExercise>({
  muscleGroup: { type: Schema.Types.ObjectId, ref: 'MuscleGroup', required: true },
  name: { type: String, required: true }
});

export const Exercise = model<IExercise>('Exercise', exerciseSchema);

