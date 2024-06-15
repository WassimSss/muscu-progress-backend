import { Request, Response } from 'express';
import { IUser, User } from '../../models/users';
import { checkData } from '../../modules/checkData';

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

const choose = async (req: Request, res: Response) => {
  const idUser = req.user?.id;
  const { program } = req.body;

  if (checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)) {
    return;
  }

  if (checkData({ program }, res, 'Le programme est requis', false)) {
    return;
  }

  const user = await User.findById(idUser);

  if (!user) {
    return res.json({
      result: false,
      message: 'Utilisateur non trouvé'
    });
  }

  user.program = program;
  await user.save();

  return res.json({
    result: true,
    message: 'Programme modifié avec succès'
  });
}

module.exports =  {get, choose} ;
export {}