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

const add =  async (req : Request, res: Response) => {
  const idUser = req.user?.id;

  const user = await User.findById(idUser) as IUser;
  // Check if the user is an admin
  checkAdmin(user, res)
  // Check if the user exists 
  checkData({ idUser: idUser }, res)

  const { name, idMuscleGroup } = req.body;

  checkData({name: name}, res)

  checkData({idMuscleGroup: idMuscleGroup}, res)


  const newExercise = new Exercise({
    muscleGroup: idMuscleGroup,
    name: name,
    
  });

  try {
    const exercise = await newExercise.save();

    res.json({
      result: true,
      message: 'Exercice ajouté avec succès',
      exercise: exercise
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      result: false,
      message: 'Erreur lors de l\'ajout de l\'exercice',
    });

  }
}
	


module.exports =  add ;
export {}