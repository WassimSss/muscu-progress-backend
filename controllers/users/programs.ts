import { Request, Response } from 'express';
import { IUser, User } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { checkAdmin } from '../../modules/checkAdmin';
import { Weight } from '../../models/weights';
import moment from 'moment';

declare module 'express' {
    
  interface Request {
      user?: IUser;
  }
}

const get =  async (req : Request, res: Response) => {
  
  const idUser = req.user?.id;

  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  const user = await User.findById(idUser) as IUser;

  if(!user){
   return res.json({result: false,
    message: 'Erreur lors de la récupération du programme'
  })
}

  return res.json({
    result: true,
    program: user.program
  });
  // Check if the user exists 



  
}

module.exports =  {get} ;
export {}