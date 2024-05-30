import { Router, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { IUser } from '../models/users';
declare module 'express' {
    
    interface Request {
        user?: IUser;
    }
}
const authenticateJWT = (req : Request, res: Response, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Supposant que le token est envoyé sous la forme "Bearer <token>"

    try {
        if (!token) {
            return res.status(401).json({ isAuthenticated: false, message: 'Aucun token fourni' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, (err : Error, user: IUser) => {
            if (err) {
                return res.status(403).json({ isAuthenticated: false, message: 'Authentification requise' });
            }
            // console.log('User:', user)
            req.user = user;
            next();
            // return res.status(201).json({ isAuthenticated: true });
        });
        // Si le token est valide, 'decoded' contiendra les informations décodées du token
    } catch (err) {
        // Si le token est invalide ou expiré, une exception sera levée
        console.error('Token invalide:', err);
    }
}

module.exports = { authenticateJWT };
export {}