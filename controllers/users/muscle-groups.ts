import { Router, Request, Response } from 'express';
import { IUser, User } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { Exercise } from '../../models/exercises';
import { MuscleGroup } from '../../models/muscleGroups';
import { checkAdmin } from '../../modules/checkAdmin';

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

const get = async (req : Request, res: Response) => {
  const idUser = req.user?.id;

  // Check if the user exists 
  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  // Get the muscle groups
  const muscleGroups = await MuscleGroup.find();

  res.json({
    result: true,
    message: 'Groupes musculaires récupérés avec succès',
    muscleGroups: muscleGroups
  });
}
	


module.exports =  {add, get} ;
export {}