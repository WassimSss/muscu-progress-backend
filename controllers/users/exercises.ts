import { Router, Request, Response } from 'express';
import { IUser, User } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { Exercise } from '../../models/exercises';
import { checkAdmin } from '../../modules/checkAdmin';
import { check } from 'express-validator';

declare module 'express' {
    
  interface Request {
      user?: IUser;
  }
}

const add =  async (req : Request, res: Response) => {
  const idUser = req.user?.id;

  const user = await User.findById(idUser) as IUser;
  // Check if the user is an admin
  if(checkAdmin(user, res)){
    return;
  }
  // Check if the user exists 
  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  const { name, idMuscleGroup } = req.body;

  // // Check if the name is provided
  if(checkData({name: name}, res, "Le nom de l'exercice est requis", false)){
    return;
  }

  const exerciseExists = await Exercise.findOne({
    name: name
  });

  // // Check if the exercise already exists
  if(checkData({exerciseExists: exerciseExists}, res, 'Cet exercice existe déjà', true)){
    return ;
  }

  // // Check if the muscle group is provided
  if(checkData({idMuscleGroup: idMuscleGroup}, res, "Le groupe musculaire est requis", false)){
    return;
  }

  const newExercise = new Exercise({
    muscleGroup: idMuscleGroup,
    name: name,
  });

  try {
    const exercise = await newExercise.save();

    return res.json({
      result: true,
      message: 'Exercice ajouté avec succès',
      exercise: exercise
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      result: false,
      message: 'Erreur lors de l\'ajout de l\'exercice',
    });

  }
}
	


module.exports =  add ;
export {}