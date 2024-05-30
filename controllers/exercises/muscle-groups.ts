import { Router, Request, Response } from 'express';
import { IUser } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { Exercise } from '../../models/exercises';
import { MuscleGroup } from '../../models/muscleGroups';

declare module 'express' {
    
  interface Request {
      user?: IUser;
  }
}

const add =  async (req : Request, res: Response) => {
  const idUser = req.user?.id;

  // Check if the user exists 
  checkData({idUser : idUser}, res)

  const name = req.body.name;

  checkData({name: name}, res)

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
	


module.exports =  add ;
export {}