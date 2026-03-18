import { type Request, type Response } from 'express';
import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config.js";

export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email non trovata" })
        }

        if (user!.password !== password) {
            return res.status(400).json({ message: "Le password non corrispondono" })
        }

        const token = jwt.sign(
            { id: user!._id, username: user!.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.log("Errore login:", error)
        res.status(500).json({ message: "Errore Login, impossibile accedere" })
    }
}