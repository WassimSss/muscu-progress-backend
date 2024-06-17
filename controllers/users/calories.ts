import { Router, Request, Response } from 'express';
import { IUser, User } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { Exercise } from '../../models/exercises';

declare module 'express' {
    
  interface Request {
      user?: IUser;
  }
}


const calcul = async (req: Request, res: Response) => {
  const idUser = req.user?.id;

  // Check if the user exists 
  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  const {weight, height, age} = req.body

  
  if(checkData({weight: weight}, res, "Votre poids est requis", false)){
    return;
  }

  if(checkData({height: height}, res, "Votre taille est requise", false)){
    return;
  }

  if(checkData({age: age}, res, "Votre âge est requis", false)){
    return;
  }

  // (9,740 x le poids en kilos) + (172,9 x la taille en mètres) – (4,737 x l'âge en années) + 667,051.

  const heightToMeters = height / 100;
  const caloricNeed = (9.740 * weight) + (172.9 * heightToMeters) - (4.737 * age) + 667.051;

  return res.json({
    result: true,
    message: 'Calcul effectué avec succès',
    caloricNeed: caloricNeed
  });
}
	


module.exports =  {calcul} ;
export {}