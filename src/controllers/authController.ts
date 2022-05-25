import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/userModel';
import Notebook from '../models/notebookModel';

let refreshTokens = [];

const authController = {
    getInfoUser: async (req: Request, res: Response) => {},
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
            //Create Notebook
            const notebook = new Notebook({
                uid: newUser.id,
                name: 'Sổ tay Đầu tiên',
                isDefault: true,
            });
            await notebook.save();

            res.status(200).json({
                status: 'failed',
                msg: 'successful account registration !',
                user: newUser,
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
    generatorAccessToken(user) {
        const accessToken = jwt.sign(
            {
                uid: user._id,
                role: user.role,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: '1d' }
        );
        return accessToken;
    },

    generatorRefreshToken(user) {
        const refreshToken = jwt.sign(
            {
                uid: user._id,
                role: user.role,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '7d' }
        );
        return refreshToken;
    },

    //Login
    login: async (req: Request, res: Response) => {
        try {
            const { password, email, username } = req.body;
            const userWithEmail = await User.findOne({ email });
            const userWithUsername = await User.findOne({ username });
            const user: any = userWithEmail || userWithUsername;

            if (user) {
                const comparePassword = await bcrypt.compare(password, user.password);

                if (comparePassword) {
                    //mật khẩu và (email hoặc tên người dùng) đúng
                    const userNotPass = { ...user._doc };
                    delete userNotPass.password;

                    //jwt
                    const accessToken = authController.generatorAccessToken(userNotPass);
                    const refreshToken = authController.generatorRefreshToken(userNotPass);
                    refreshTokens.push(refreshToken);

                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        path: '/',
                        sameSite: 'strict',
                        secure: false,
                        maxAge: 90000,
                    });

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
                        msg: (userWithEmail ? 'email' : 'username') + ' or password is incorrect !',
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

    logout: async (req: Request, res: Response) => {
        try {
            res.clearCookie('refreshToken');
            refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
            res.status(200).json({ status: 'success', msg: 'logged out !' });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },

    requestRefreshToken: async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            console.log({ refreshToken });
            if (!refreshToken)
                return res
                    .status(401)
                    .json({ status: 'failed', msg: 'you are not authenticated !' });

            if (!refreshTokens.includes(refreshToken))
                return res
                    .status(403)
                    .json({ status: 'failed', msg: 'refresh token is not valid !' });

            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (error, user) => {
                if (error) {
                    return res
                        .status(403)
                        .json({ status: 'failed', msg: 'refresh token is not valid !' });
                }
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

                const newAccessToken = authController.generatorAccessToken(user);
                const newRefreshToken = authController.generatorRefreshToken(user);
                refreshTokens.push(newRefreshToken);

                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    path: '/',
                    secure: false,
                });

                res.status(200).json({ status: 'success', accessToken: newAccessToken });
            });
            res.status(200).json({ refreshToken });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default authController;
