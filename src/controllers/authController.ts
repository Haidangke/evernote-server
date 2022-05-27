import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/userModel';
import Notebook from '../models/notebookModel';
import { IGetUserAuthInfoRequest, User } from '../middleware/verifyToken';

let refreshTokens = [];

const authController = {
    getInfoUser: async (req: IGetUserAuthInfoRequest, res: Response) => {
        try {
            const uid = req.user.uid;
            const user = await UserModel.findById(uid);

            delete user._doc.password;
            res.status(200).json({
                status: 'success',
                msg: 'get info user successfully !',
                data: { user },
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
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
            const userWithEmail = await UserModel.findOne({ email });
            const userWithUsername = await UserModel.findOne({ username });
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

            const newUser = new UserModel({
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
            delete newUser._doc.password;
            res.status(200).json({
                status: 'failed',
                msg: 'successful account registration !',
                data: newUser,
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
            { expiresIn: '5s' }
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
            const userWithEmail = await UserModel.findOne({ email });
            const userWithUsername = await UserModel.findOne({ username });
            const user: any = userWithEmail || userWithUsername;

            if (user) {
                const comparePassword = await bcrypt.compare(password, user.password);

                if (comparePassword) {
                    //mật khẩu và (email hoặc tên người dùng) đúng
                    delete user._doc.password;

                    //jwt
                    const accessToken = authController.generatorAccessToken(user);
                    const refreshToken = authController.generatorRefreshToken(user);
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
                        data: { user, accessToken },
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
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken)
                return res
                    .status(401)
                    .json({ status: 'failed', msg: 'you are not authenticated !' });

            if (!refreshTokens.includes(refreshToken))
                return res
                    .status(403)
                    .json({ status: 'failed', msg: 'refresh token is not valid !' });

            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (error, user: User) => {
                console.log({ refreshTokenUser: user });
                const newUser = {
                    role: user.role,
                    _id: user.uid,
                };
                if (error) {
                    return res
                        .status(403)
                        .json({ status: 'failed', msg: 'refresh token is not valid !' });
                }
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
                console.log({ userRe: user });
                const newAccessToken = authController.generatorAccessToken(newUser);
                const newRefreshToken = authController.generatorRefreshToken(newUser);
                refreshTokens.push(newRefreshToken);

                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    path: '/',
                    secure: false,
                });

                res.status(200).json({ status: 'success', data: newAccessToken });
            });
        } catch (error) {
            res.status(500).json({ status: 'failed', msg: error.message });
        }
    },
};

export default authController;
