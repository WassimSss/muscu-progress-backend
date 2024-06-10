import { Schema, model, Document } from 'mongoose';

interface WorkoutReference {
  date: Date;
  workout: Schema.Types.ObjectId;
}

interface WeightReference {
  date: Date;
  weight: number
}

interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  age?: number;
  height?: number;
  gender?: 'Male' | 'Female' ;
  dailyCalories: Schema.Types.ObjectId[];
  workouts: WorkoutReference[];
  weights: WeightReference[];
  roles: string[];
}

const weightReferenceSchema = new Schema<WeightReference>({
  date: { type: Date, required: true },
  weight: {type: Number, required: true}
});


const workoutReferenceSchema = new Schema<WorkoutReference>({
  date: { type: Date, required: true },
  workout: { type: Schema.Types.ObjectId, ref: 'WorkoutExercise', required: true }
});

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
  height: { type: Number },
  gender: { type: String, enum: ['Male', 'Female'] },
  weights: [weightReferenceSchema],
  dailyCalories: [{ type: Schema.Types.ObjectId, ref: 'DailyCalorie' }],
  workouts: [workoutReferenceSchema],
  roles: [{ type: String }]
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export { User, IUser };


