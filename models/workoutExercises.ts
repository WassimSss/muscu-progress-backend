import { Schema, model, Document } from 'mongoose';

interface ISet extends Document {
  weight: number;
  repetitions: number;
  type: string;
}
interface IWorkoutExercise extends Document {
  user: Schema.Types.ObjectId;
  muscleGroup: Schema.Types.ObjectId;
  name: Schema.Types.ObjectId; // Groupe musculaire
  sets: {
    weight: number,
    repetitions: number,
    type: string
  }[];
  date: Date;
}



const setSchema = new Schema<ISet> ({
  weight: { type: Number },
  repetitions: { type: Number },
  type: { type: String , enum: ['dumbbell', 'machine', 'cable', 'bodyweight']}
});

const workoutExerciseSchema = new Schema<IWorkoutExercise>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  muscleGroup: { type: Schema.Types.ObjectId, ref: 'MuscleGroup', required: true },
  name: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets: [setSchema],
  date: { type: Date, default: Date.now }
});

const WorkoutExercise = model<IWorkoutExercise>('WorkoutExercise', workoutExerciseSchema);

export { WorkoutExercise, IWorkoutExercise };


