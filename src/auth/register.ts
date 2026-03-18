import { type Request, type Response } from 'express';
import { User } from '../models/userModel.js';

export const Register = async (req: Request, res: Response) => {
    try {

        const newUsername = req.body.username
        const newEmail = req.body.email
        const newPassword = req.body.password

        const exists = await User.findOne({ email: newEmail });

        if (exists) return res.status(400).json({ message: "Email già registrata" });

        const newUser = new User({username: newUsername, email: newEmail, password: newPassword})

        await newUser.save()

        return res.status(201).json({message: "Utente creato con successo"})

    } catch (error) {
        console.log("ERRORE:", error)
        
        return res.status(500).json({message: "Creazione utente fallita"})

    }
}