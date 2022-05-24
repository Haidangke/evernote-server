import { Request, Response } from 'express';

const routerController = {
    createTodo: async (req: Request, res: Response) => {
        try {
            const { uid } = req.body; 
        } catch (error) {}
    },
};

export default routerController;
