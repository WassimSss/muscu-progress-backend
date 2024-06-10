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
  // if(checkData({weight: weight}, res, "Le poids est requis", false)){
  //   return;
  // }

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

const get = async (req: Request, res: Response) => {
  const idUser = req.user?.id;
  const { date } = req.params;

  // Check if the user exists 
  if (!idUser) {
    return res.status(404).json({ result: false, message: 'Utilisateur non trouvé' });
  }

  const parsedDate = moment(date, 'YYYY-MM-DD').utcOffset(0, true);
  if (!parsedDate.isValid()) {
    return res.status(400).json({ result: false, message: 'Date invalide' });
  }

  const startOfDay = moment().utcOffset(0, true).startOf('day').toDate();
  const endOfDay = moment().utcOffset(0, true).endOf('day').toDate();

  console.log(startOfDay, endOfDay);
  
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
        from: 'musclegroups',
        localField: 'workoutDetails.muscleGroup',
        foreignField: '_id',
        as: 'muscleGroupDetails'
      }
    },
    { $unwind: '$muscleGroupDetails' },
    {
      $lookup: {
        from: 'exercises',
        localField: 'workoutDetails.name',
        foreignField: '_id',
        as: 'exerciseDetails'
      }
    },
    { $unwind: '$exerciseDetails' },
    { $unwind: '$workoutDetails.sets' }, // Unwind sets to get individual sets
    {
      $project: {
        _id: 0,
        muscleGroup: '$muscleGroupDetails.name',
        exerciseName: '$exerciseDetails.name',
        weight: '$workoutDetails.sets.weight',
        reps: '$workoutDetails.sets.repetitions',
        idSet: '$workoutDetails.sets._id', // Include workout ID
      }
    }
  ]);

  // Structure the results
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const { muscleGroup, exerciseName, weight, reps, idSet } = workout;

    let muscleGroupEntry = acc.find(group => group.muscleGroup === muscleGroup);

    if (!muscleGroupEntry) {
      muscleGroupEntry = { muscleGroup, exercises: [] };
      acc.push(muscleGroupEntry);
    }

    let exerciseEntry = muscleGroupEntry.exercises.find(exercise => exercise.name === exerciseName);

    if (!exerciseEntry) {
      exerciseEntry = { name: exerciseName, sets: [] };
      muscleGroupEntry.exercises.push(exerciseEntry);
    }

    exerciseEntry.sets.push({ weight, reps, idSet });

    return acc;
  }, []);

  return res.json({
    result: true,
    workouts: groupedWorkouts
  });
};

const removeSet = async (req: Request, res: Response) => {
  const idUser = req.user?.id;
  const { idSet } = req.params;

  // Check if the user exists 
  if (checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)) {
    return;
  }

  // Check if the idSet is provided
  if (checkData({ idSet: idSet }, res, "L'id de la série est requis", false)) {
    return;
  }

  const workout = await WorkoutExercise.findOne({ user: idUser, 'sets._id': idSet });

  if (!workout) {
    return res.json({
      result: false,
      message: 'Série non trouvée'
    });
  }


  const deletedSet = await WorkoutExercise.updateOne(
    { user: idUser, 'sets._id': idSet },
    { $pull: { sets: { _id: idSet } } }
  );

  if (deletedSet.modifiedCount === 0) {
    return res.status(404).json({
      result: false,
      message: 'Set non trouvé ou déjà supprimé'
    });
  }

  res.json({
          result: true,
          message: 'Série supprimée avec succès'
        });
}

const getWorkedDaysInMonth = async (req: Request, res: Response) => {
  const idUser = req.user?.id;
  
  const { month, year } = req.params;

  // Valider les entrées
  if (!month || !year || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
    return res.status(400).json({
      result: false,
      message: 'Mois ou année invalide'
    });
  }

  // Calculer le début et la fin du mois
  const startOfMonth = moment().year(parseInt(year)).month(parseInt(month) - 1).startOf('month').toDate();
  const endOfMonth = moment().year(parseInt(year)).month(parseInt(month) - 1).endOf('month').toDate();

  try {
    const user = await User.findById(idUser).select('workouts').lean();

    if (!user) {
      return res.status(404).json({
        result: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Filtrer les workouts pour obtenir ceux du mois spécifié
    const workoutsInMonth = user.workouts.filter(workout => {
      return workout.date >= startOfMonth && workout.date <= endOfMonth;
    });

    // Extraire les dates uniques
    const workedDays = Array.from(new Set(workoutsInMonth.map(workout => workout.date.toISOString().split('T')[0])));

    return res.json({
      result: true,
      workedDays
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: 'Erreur serveur'
    });
  }
};




	


module.exports =  {add, get, removeSet, getWorkedDaysInMonth} ;
export {}