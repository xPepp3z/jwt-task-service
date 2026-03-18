import { body } from 'express-validator';

export const validateTasks = [
    body("title").isString().notEmpty().withMessage("Il titolo non può essere vuoto"),
    body("completed").isBoolean().notEmpty().withMessage("Lo stato non può essere vuoto"),
    ]
