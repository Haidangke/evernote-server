import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/userModel';

const userController = {
    //Register
    register: async (req: Request, res: Response) => {
        try {
            const { password, email, username } = req.body;

            if (password.length < 6)
                return res.status(400).json({
                    status: 'failed',
                    msg: 'password must be more than 6 characters !',
                });

            if (!password || !email || !username) {
                return res.status(400).json({
                    status: 'failed',
                    msg: 'invalid user information !',
                });
            }

            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);

            //Create user
            const userWithEmail = await User.findOne({ email });
            const userWithUsername = await User.findOne({ username });
            if (userWithEmail)
                return res.status(400).json({
                    status: 'failed',
                    msg: 'email already exists !',
                });
            if (userWithUsername)
                return res.status(400).json({
                    status: 'failed',
                    msg: ' username already exists !',
                });

            const newUser = new User({
                username,
                email,
                password: hashPassword,
            });

            await newUser.save();
            res.status(200).json({
                status: 'failed',
                msg: 'successful account registration !',
                user: newUser,
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    //Login
    login: async (req: Request, res: Response) => {
        try {
            const { password, email, username } = req.body;
            const userWithEmail = await User.findOne({ email });
            const userWithUsername = await User.findOne({ username });
            const user: any = userWithEmail || userWithUsername;

            if (user) {
                const comparePassword = await bcrypt.compare(
                    password,
                    user.password
                );

                if (comparePassword) {
                    //mật khẩu và (email hoặc tên người dùng) đúng
                    const userNotPass = { ...user._doc };
                    delete userNotPass.password;

                    //jwt
                    const accessToken = jwt.sign(
                        {
                            uid: userNotPass._id,
                            role: userNotPass.role,
                        },
                        process.env.JWT_ACCESS_KEY,
                        { expiresIn: '1d' }
                    );
                    return res.status(200).json({
                        status: 'sucess',
                        msg: 'logged in successfully !',
                        accessToken,
                        user: userNotPass,
                    });
                } else {
                    //mật khẩu sai
                    return res.status(401).json({
                        status: 'failed',
                        msg:
                            (userWithEmail ? 'email' : 'username') +
                            ' or password is incorrect !',
                    });
                }
            } else {
                // không có tài khoản
                return res.status(401).json({
                    status: 'failed',
                    msg: 'this account does not exist !',
                });
            }
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default userController;
