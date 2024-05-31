import { Request, Response } from 'express';
import { IUser, User } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { WorkoutExercise } from '../../models/workoutExercises';
const moment = require('moment');
const mongoose = require('mongoose');
declare module 'express' {
    
  interface Request {
      user?: IUser;
  }
}

const add =  async (req : Request, res: Response) => {
  const idUser = req.user?.id;
  // Check if the user exists 
  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  const {idMuscleGroup, idExercise, weight, repetitions} = req.body;

  // Check if the idMuscleGroup is provided
  if(checkData({idMuscleGroup: idMuscleGroup}, res, "L'id du groupe musculaire est requis", false)){
    return;
  }

  // Check if the idExercise is provided
  if(checkData({idExercise: idExercise}, res, "L'id de l'exercice est requis", false)){
    return;
  }

  // Check if the weight is provided
  if(checkData({weight: weight}, res, "Le poids est requis", false)){
    return;
  }

  // Check if the repetitions is provided
  if(checkData({repetitions: repetitions}, res, "Le nombre de répétitions est requis", false)){
    return;
  }

  // If today there is a workout with same muscle group and exercise, add the new set to the workout
  const today = moment().utcOffset(0, true);
  const startOfDay = moment().utcOffset(0, true).startOf('day').toDate();
  const endOfDay = moment().utcOffset(0, true).endOf('day').toDate();

  // Check if the workout exists
  const workout = await WorkoutExercise.findOne({user: idUser, muscleGroup: idMuscleGroup, name: idExercise, date: {$gte: startOfDay, $lte: endOfDay}});

  // If the workout exists, add the new set to the workout
  if(workout){

    workout.sets.push({
      weight: weight,
      repetitions: repetitions
    });

    await workout.save();

    return res.json({
      result: true,
      message: 'Séries ajoutées avec succès',
      workout: workout
    });

  // If the workout doesn't exist, create a new workout
  } else {
    const newWorkout = new WorkoutExercise({
      user: idUser,
      muscleGroup: idMuscleGroup,
      name: idExercise,
      sets: [{
        weight: weight,
        repetitions: repetitions
      }]
    });

    // Add the workout to the user
    await User.updateOne({_id: idUser}, { $push: { workouts: {workout: newWorkout._id, date: today} } })

    await newWorkout.save();

    return res.json({
      result: true,
      message: 'Exercice ajouté avec succès',
      workout: newWorkout
    });
  }
}

const get =  async (req : Request, res: Response) => {
  const idUser = req.user?.id;
  // Check if the user exists 
  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  const today = moment().utcOffset(0, true);
  const startOfDay = moment().utcOffset(0, true).startOf('day').toDate();
  const endOfDay = moment().utcOffset(0, true).endOf('day').toDate();

  const workouts = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(idUser) } },
    { $unwind: '$workouts' },
    { $match: { 'workouts.date': { $gte: startOfDay, $lt: endOfDay } } },
    {
      $lookup: {
        from: 'workoutexercises', 
        localField: 'workouts.workout',
        foreignField: '_id',
        as: 'workoutDetails'
      }
    },
    { $unwind: '$workoutDetails' },
    {
      $lookup: {
        from: 'musclegroups', // Nom de la collection MuscleGroup
        localField: 'workoutDetails.muscleGroup',
        foreignField: '_id',
        as: 'muscleGroupDetails'
      }
    },
    { $unwind: '$muscleGroupDetails' },
    {
      $lookup: {
        from: 'exercises', // Nom de la collection Exercise
        localField: 'workoutDetails.name',
        foreignField: '_id',
        as: 'exerciseDetails'
      }
    },
    { $unwind: '$exerciseDetails' },
    {
      $project: {
        _id: 0,
        workoutDetails: 1,
        muscleGroup: '$muscleGroupDetails.name', // Nom du groupe musculaire
        exerciseName: '$exerciseDetails.name', // Nom de l'exercice

      }
    },
    
  ])

  return res.json({
    result: true,
    workouts: workouts
  });

  // const workouts = await User.findOne({_id: idUser}).populate('workouts.workout');



  

  console.log(workouts)

 
  
}
	


module.exports =  {add, get} ;
export {}