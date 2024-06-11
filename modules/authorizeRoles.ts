import { Request, Response } from 'express';
import { IUser } from '../models/users';
declare module 'express' {
    
  interface Request {
      user?: IUser;
  }
}

const authorizeRoles = (...allowedRoles) => {
  return (req: Request, res: Response, next) => {
    const userRoles = req.user?.roles; // Assurez-vous que `req.user` est peuplé, probablement par un middleware d'authentification préalable
    console.log(req.user)
    console.log('User roles:', userRoles);
    const hasRole = userRoles?.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    next();
  };
};

module.exports = { authorizeRoles };
export {}