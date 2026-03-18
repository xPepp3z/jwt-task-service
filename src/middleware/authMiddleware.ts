import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { body } from 'express-validator';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _id: string;
      username: string;
    };
  }
}

// Middleware per leggere JWT dall'URL

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return res.status(401).json({ message: 'Nessun token fornito' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Salva l'utente decodificato nella richiesta
    req.user = { _id: decoded.id, username: decoded.username };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido ' + err });
  }
};

export const validateRegister = [
  body('email').isEmail().withMessage('Devi inserire una mail valida'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La password deve essere minimo di 6 caratteri'),
  body('username')
    .notEmpty()
    .withMessage('Il campo username non può essere vuoto'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Devi inserire una mail valida'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La password deve essere minimo di 6 caratteri'),
];
