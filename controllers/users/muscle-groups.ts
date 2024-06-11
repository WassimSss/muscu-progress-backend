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
	
module.exports =  {get} ;
export {}