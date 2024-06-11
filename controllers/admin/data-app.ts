import { Router, Request, Response } from 'express';
import { IUser, User } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { Exercise } from '../../models/exercises';
import { checkAdmin } from '../../modules/checkAdmin';
import { MuscleGroup } from '../../models/muscleGroups';

declare module 'express' {
    
  interface Request {
      user?: IUser;
  }
}

const addExercise =  async (req : Request, res: Response) => {
  const idUser = req.user?.id;

  const user = await User.findById(idUser) as IUser;
  // Check if the user exists 
  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  const { name, idMuscleGroup } = req.body;

  // // Check if the name is provided
  if(checkData({name: name}, res, "Le nom de l'exercice est requis", false)){
    return;
  }

  if(checkData({idMuscleGroup: idMuscleGroup}, res, "Le groupe musculaire est requis", false)){
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

const addMuscleGroup =  async (req : Request, res: Response) => {
  const idUser = req.user?.id;

  const user = await User.findById(idUser) as IUser;

  // Check if the user exists 
  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  // Check if the name is provided
  const name = req.body.name;
   if(checkData({name: name}, res, "Le nom de l'exercice est requis", false)){
    return;
  }

  // Check if the muscle group already exists
  const muscleGroupExists = await MuscleGroup.findOne({
    name: name
  });

  if(checkData({muscleGroupExists: muscleGroupExists}, res, 'Ce groupe musculaire existe déjà', true)){
    return ;
  }

  const newMuscleGroup = new MuscleGroup({
    name: name,  
  });

  try {
    const muscleGroup = await newMuscleGroup.save();

    res.json({
      result: true,
      message: 'Groupe musculaire ajouté avec succès',
      muscleGroup: muscleGroup
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      result: false,
      message: 'Erreur lors de l\'ajout du groupe musculaire',
    });

  }

  

  
}

module.exports =  {addExercise, addMuscleGroup} ;
export {}