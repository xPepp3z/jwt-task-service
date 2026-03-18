import { Task } from "../models/taskModel.js"
import { type Request, type Response} from 'express';

export const getTasks = (async (req: Request ,res: Response) => {

    try {

        const allTasks = await Task.find()
        return res.status(200).json(allTasks)
        
    } catch (error) {
        res.status(500).json({ message: "Errore server, richiesta non accolta " +error})
    }

})

export const getMyTasks = async (req: Request, res: Response) => {

    try {
 
        const tasks = await Task.find({ user: req.user!._id })
        return res.status(200).json(tasks)
        
    } catch (error) {

        res.status(500).json({ message: "Errore server, richiesta non accolta " +error})

    }


}

export const createTask = async (req: Request, res: Response) => {

    try {
        const newTitle = req.body.title
        const newCompleted = req.body.completed

        const newTask = new Task({ title: newTitle, completed: newCompleted, user: req.user!._id })

        await newTask.save()

        return res.status(201).json({ message: `Task aggiunta con successo, denominata: ${newTitle}` })

    } catch (error) {
        res.status(500).json({ message: "Errore server, richiesta non accolta " +error})
    }

}

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: `Task con id ${id} non trovata` });
        }

        if (task.user!.toString() !== req.user!._id) {
            return res.status(403).json({ message: "Non puoi modificare un task non tuo" });
        }

        // Aggiorno solamente i campi immessi
        task.title = title ?? task.title;
        task.completed = completed ?? task.completed;

        await task.save();

        return res.status(200).json({ 
            message: "Task aggiornata con successo", 
            task
        });
    } catch (error) {
        res.status(500).json({ message: "Errore server, richiesta non accolta " +error})
    }
}

export const updateAllTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: `Task con id ${id} non trovata` });
        }

        if (task.user!.toString() !== req.user!._id) {
            return res.status(403).json({ message: "Non puoi modificare un task non tuo" });
        }

        if(!task.title || !task.completed){
            return res.status(400).json({message: "Tutti i campi devono essere riempiti"})
        }

        // Aggiorna solo i campi presenti
        task.title = title;
        task.completed = completed;


        await task.save();

        return res.status(200).json({ 
            message: "Task aggiornata con successo", 
        });
    } catch (error) {
        res.status(500).json({ message: "Errore server, richiesta non accolta " +error})
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: `Task con id ${id} non trovata` });
        }

        if (task.user!.toString() !== req.user!._id) {
            return res.status(403).json({ message: "Non puoi eliminare questa task" });
        }

        await task.deleteOne();

        return res.status(200).json({ message: `Task con id ${id} eliminata con successo` });
    } catch (error) {
        res.status(500).json({ message: "Errore server, richiesta non accolta " +error})
    }
}
