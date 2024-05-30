import {Response} from "express";
import { IUser } from "../models/users";

const checkAdmin = (user : IUser, res:Response ) => {
  if (!user.roles?.includes('ROLE_ADMIN')) {
    return res.status(403).json({
      result: false,
      message: 'Vous n\'avez pas les droits pour ajouter un exercice',
    });
  }
}
export { checkAdmin }; // Add this line to export the checkUser function
