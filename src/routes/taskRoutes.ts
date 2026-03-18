import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateAllTask,
  getMyTasks,
} from '../controllers/taskController.js';
import { validateTasks } from '../middleware/taskMiddleware.js';
import { validationResult } from 'express-validator';
import { type Request, type Response, type NextFunction } from 'express';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = Router();

// Middleware per validazione
const checkValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Ottieni tutti i tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Lista tasks utente
 */
router.get('/', getTasks);
/**
 * @swagger
 * /tasks/me:
 *   get:
 *     summary: Ottieni le task dell'utente autenticato
 *     tags: [Tasks]
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
 *         description: Lista task utente
 *       401:
 *         description: Token assente o non valido
 *       500:
 *         description: Errore server
 */
router.get('/me', verifyJWT, getMyTasks);
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crea una nuova task
 *     tags: [Tasks]
 *     security:
 *       - TokenQueryAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT da passare come query parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - completed
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Studiare Swagger"
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Task creata
 *       401:
 *         description: Token assente o non valido
 *       500:
 *         description: Errore server
 */
router.post('/', verifyJWT, validateTasks, checkValidation, createTask);
/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Aggiorna parzialmente una task
 *     tags: [Tasks]
 *     security:
 *       - TokenQueryAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT da passare come query parameter
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task aggiornata
 *       401:
 *         description: Token assente o non valido
 *       404:
 *         description: Task non trovata
 *       403:
 *         description: Non autorizzato
 */
router.patch('/:id', verifyJWT, validateTasks, checkValidation, updateTask);
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Aggiorna completamente una task
 *     tags: [Tasks]
 *     security:
 *       - TokenQueryAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT da passare come query parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - completed
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task aggiornata
 *       400:
 *         description: Campi mancanti
 *       401:
 *         description: Token assente o non valido
 *       404:
 *         description: Task non trovata
 *       403:
 *         description: Non autorizzato
 */
router.put('/:id', verifyJWT, validateTasks, checkValidation, updateAllTask);
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Elimina una task
 *     tags: [Tasks]
 *     security:
 *       - TokenQueryAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT da passare come query parameter
 *     responses:
 *       200:
 *         description: Task eliminata
 *       401:
 *         description: Token assente o non valido
 *       404:
 *         description: Task non trovata
 *       403:
 *         description: Non autorizzato
 */
router.delete('/:id', verifyJWT, deleteTask);

export default router;
