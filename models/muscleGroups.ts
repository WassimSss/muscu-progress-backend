import { Schema, model, Document } from 'mongoose';

interface IMuscleGroup extends Document {
  name: string;
}

const muscleGroupSchema = new Schema<IMuscleGroup>({
  name: { type: String, required: true }
});

export const MuscleGroup = model<IMuscleGroup>('MuscleGroup', muscleGroupSchema);