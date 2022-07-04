import { Request, Response } from 'express';
import cloudinary from '../configs/cloudinary.config';

const cloudinaryController = {
    upload: async (req: Request, res: Response) => {
        try {
            const fileStr = req.body.file;

            const uploadResponse = await cloudinary.uploader.upload(fileStr);
            res.status(200).json({ data: uploadResponse, status: 'success' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ err: 'Something went wrong' });
        }
    },
};

export default cloudinaryController;
