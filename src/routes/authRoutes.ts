import { Router } from 'express';
import { validationResult } from 'express-validator';
import { type Request, type Response, type NextFunction } from 'express';
import { Register } from '../auth/register.js';
import { Login } from '../auth/login.js';
import {
  validateLogin,
  validateRegister,
  verifyJWT,
} from '../middleware/authMiddleware.js';
import { Delete } from '../auth/delete.js';

const router = Router();

// Middleware per validazione
const checkValidation = (req: Request, res: Response, next: NextFunction) => {
  console.log('checkValidation chiamato');
  const errors = validationResult(req);
  console.log('Errori trovati:', JSON.stringify(errors.array()));

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: mario
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *       400:
 *         description: Dati non validi o email gia registrata
 *       500:
 *         description: Errore server
 */
router.post('/register', validateRegister, checkValidation, Register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Effettua il login e restituisce un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login riuscito
 *       400:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore server
 */
router.post('/login', validateLogin, checkValidation, Login);

/**
 * @swagger
 * /auth/delete:
 *   delete:
 *     summary: Elimina account e task associate dell'utente autenticato
 *     tags: [Auth]
 *     security:
 *       - TokenQueryAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT da passare come query parameter
 *     responses:
 *       200:
 *         description: Utente eliminato con successo
 *       401:
 *         description: Token assente o non valido
 *       404:
 *         description: Utente non trovato
 *       500:
 *         description: Errore server
 */
router.delete('/delete', verifyJWT, Delete);

export default router;
