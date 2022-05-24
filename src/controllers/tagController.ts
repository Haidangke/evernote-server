import { Request, Response } from 'express';
import Note from '../models/noteModel';
import Tag from '../models/tagModel';

const tagController = {
    createTag: async (req: Request, res: Response) => {
        try {
            const { uid, name } = req.body;

            if (!name)
                return res.status(400).json({
                    status: 'failed',
                    msg: 'name tag is not defined !',
                });

            const tag = new Tag({
                uid,
                name,
            });

            tag.save();
            res.status(200).json({
                tag,
                status: 'success',
                msg: 'create tag successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //thêm thẻ
    addTag: async (req: Request, res: Response) => {
        try {
            const { noteId, listTagId } = req.body;
            const listTag = [];
            const note = await Note.findById(noteId);
            const curTag = note.tag;
            const curTagId = curTag.map((x) => x.id);

            for (let i = 0; i < listTagId.length; i++) {
                if (!curTagId.includes(listTagId[i])) {
                    const tag = await Tag.findById(listTagId[i]);
                    listTag.push(tag);
                }
            }

            const newNote = await Note.findByIdAndUpdate(
                noteId,
                {
                    tag: [...curTag, ...listTag],
                },
                { new: true }
            );

            res.status(200).json({
                note: newNote,
                status: 'success',
                message: 'add tag successfully !',
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //xóa thẻ
    deleteTag: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            await Tag.findByIdAndRemove(id);
            await Note.updateMany(
                { 'tag._id': id },
                {
                    $pull: {
                        tag: { _id: id },
                    },
                }
            );
            res.json('success');
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //loại bỏ thẻ
    removeTag: async (req: Request, res: Response) => {
        try {
            const { noteId, tagId } = req.query;
            const note = await Note.findById(noteId);

            const tag = note.tag;
            const newTag = note.tag.map((tag) => tag._id);
            tag.splice(newTag.indexOf(tagId), 1);

            await Note.findByIdAndUpdate(noteId, {
                ...note,
                tag,
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default tagController;
