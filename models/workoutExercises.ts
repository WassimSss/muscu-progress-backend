import { Schema, model, Document } from 'mongoose';

interface IWorkoutExercise extends Document {
  user: Schema.Types.ObjectId;
  muscleGroup: Schema.Types.ObjectId;
  name: string; // Groupe musculaire
  sets: { // Séries
    weight: number; // Poids en kg 
    repetitions: number; 
  }[];
  date: Date;
}

const workoutExerciseSchema = new Schema<IWorkoutExercise>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  muscleGroup: { type: Schema.Types.ObjectId, ref: 'MuscleGroup', required: true },
  name: { type: String, required: true },
  sets: [{
    weight: { type: Number },
    repetitions: { type: Number }
  }],
  date: { type: Date, default: Date.now }
});

export const WorkoutExercise = model<IWorkoutExercise>('WorkoutExercise', workoutExerciseSchema);
