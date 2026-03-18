import { Task } from "../models/taskModel.js";
import { User } from "../models/userModel.js"
import { type Request, type Response, } from 'express';


export const Delete = async (req: Request, res: Response) => {
    try {
        await Task.deleteMany({ user: req.user!._id })
        const user = await User.findByIdAndDelete(req.user!._id)

        if (!user) return res.status(404).json({ message: "Utente non trovato" })
        
        return res.status(200).json({ message: "Utente eliminato con successo" })
        
    } catch (error) {
        return res.status(500).json({ message: `Errore server: ${error}` })
    }
}