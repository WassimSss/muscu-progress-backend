import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  age?: number;
  height?: number;
  gender?: 'Male' | 'Female' ;
  weights: Schema.Types.ObjectId[];
  dailyCalories: Schema.Types.ObjectId[];
  exercises: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
  height: { type: Number },
  gender: { type: String, enum: ['Male', 'Female'] },
  weights: [{ type: Schema.Types.ObjectId, ref: 'Weight' }],
  dailyCalories: [{ type: Schema.Types.ObjectId, ref: 'DailyCalorie' }],
  exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export { User, IUser };


