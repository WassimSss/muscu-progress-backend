import { Request, Response } from 'express';
import { IUser } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { WorkoutExercise } from '../../models/workoutExercises';


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

  // If todat, there is a workout with same muscle group and exercise, add the new set to the workout
  const workout = await WorkoutExercise.findOne({user: idUser, muscleGroup: idMuscleGroup, name: idExercise, date:{ $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) }});

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

    await newWorkout.save();

    return res.json({
      result: true,
      message: 'Exercice ajouté avec succès',
      workout: newWorkout
    });
  }
}
	


module.exports =  add ;
export {}