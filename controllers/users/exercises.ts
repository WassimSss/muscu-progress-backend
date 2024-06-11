import { Router, Request, Response } from 'express';
import { IUser, User } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { Exercise } from '../../models/exercises';
import { checkAdmin } from '../../modules/checkAdmin';

declare module 'express' {
    
  interface Request {
      user?: IUser;
  }
}


const get = async (req: Request, res: Response) => {
  const idUser = req.user?.id;

  // Check if the user exists 
  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  const idMuscleGroup = req.params.idMuscleGroup

  // Check if the muscle group is provided
  if(checkData({idMuscleGroup: idMuscleGroup}, res, "L'identifiant du groupe musculaire est requis", false)){
    return;
  }

  const exercises = await Exercise.find({ muscleGroup: idMuscleGroup });

  return res.json({
    result: true,
    message: 'Exercices trouvés',
    exercises: exercises
  });
}
	


module.exports =  {get} ;
export {}