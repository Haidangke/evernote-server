import { Response } from 'express';
import { IGetUserAuthInfoRequest } from '../middleware/verifyToken';
import Notebook from '../models/notebookModel';

const notebookController = {
    createNotebook: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const { name } = req.body;
            if (!name)
                return res.status(400).json({
                    status: 'failed',
                    msg: 'the name of the notebook is not valid ! ',
                });
            const notebook = await Notebook.findOne({ name });
            if (notebook)
                return res
                    .status(400)
                    .json({ status: 'failed', msg: 'the name of this manual has been used !' });
            const newNotebook = new Notebook({ uid, name });
            await newNotebook.save();

            res.status(200).json({
                notebook: newNotebook,
                status: 'success',
                msg: 'create notebook successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    updateNotebook: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const id = req.params.id;
            const uid = req.user.uid;
            const { name, isDefault } = req.body;
            if (!name && !isDefault)
                return res.status(400).json({
                    status: 'failed',
                    msg: 'invalid update information !',
                });
            if (name) {
                const notebook = await Notebook.findOne({ name, uid });
                if (notebook)
                    return res
                        .status(400)
                        .json({ status: 'failed', msg: 'the name of this manual has been used !' });
                const newNotebook = await Notebook.findOneAndUpdate(
                    { _id: id, uid },
                    {
                        name,
                    },
                    { new: true }
                );
                res.status(200).json({
                    notebook: newNotebook,
                    status: 'success',
                    msg: 'update name notebook successfully !',
                });
            }
            if (isDefault) {
                console.log({ isDefault });
                await Notebook.findOneAndUpdate(
                    { uid, isDefault: true },
                    {
                        isDefault: false,
                    }
                );
                const newNotebook = await Notebook.findOneAndUpdate(
                    { _id: id, uid },
                    {
                        isDefault,
                    },
                    { new: true }
                );

                res.status(200).json({
                    notebook: newNotebook,
                    status: 'success',
                    msg: 'update default notebook successfully !',
                });
            }
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },


    
};

export default notebookController;
