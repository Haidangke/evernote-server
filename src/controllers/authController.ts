import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import { generatorAccessToken, generatorRefreshToken } from '../handlers/tokenHandler';
import UserModel from '../models/userModel';
import { IGetUserAuthInfoRequest, User } from '../middleware/verifyToken';
import ScheduledModel from '../models/scheduleModel';

const authController = {
    checkEmail: asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({
                status: 'failed',
                msg: 'Email này đã chưa đăng kí tài khoản.',
                data: false,
            });
        } else {
            res.status(200).json({
                status: 'success',
                data: true,
            });
        }
    }),

    //Register
    register: asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { password, email, username } = req.body;

        if (!password || !email || !username) {
            return res.status(400).json({
                status: 'failed',
                msg: 'Thông tin tài khoản không hợp lệ',
            });
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).json({
                status: 'failed',
                msg: 'Please enter a valid email',
            });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        //Create user
        const existingUser = await UserModel.findOne({ email });

        if (existingUser)
            return res.status(400).json({
                status: 'failed',
                msg: 'Email này đã được sử dụng',
            });

        const user = new UserModel({
            username,
            email,
            password: hashPassword,
        });
        await user.save();

        //Create Notebook
        res.status(200).json({
            status: 'success',
            msg: 'Đăng kí tài khoản thành công',
        });
    }),

    //Login
    login: asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { password, email, deviceToken } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) {
            const comparePassword = await bcrypt.compare(password, user.password);

            if (comparePassword) {
                const accessToken = generatorAccessToken(user);
                const refreshToken = generatorRefreshToken(user);

                await UserModel.findOneAndUpdate(
                    { _id: user._id },
                    { $push: { refreshTokens: refreshToken }, deviceToken },
                    { new: true }
                );

                await ScheduledModel.updateMany({ uid: user._id }, { token: deviceToken });

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
                    data: accessToken,
                });
            } else {
                //mật khẩu sai
                return res.status(401).json({
                    status: 'failed',
                    msg: 'Email hoặc mật khẩu không chính xác.',
                });
            }
        } else {
            // không có tài khoản
            return res.status(401).json({
                status: 'failed',
                msg: 'Email này chưa đăng kí tài khoản.',
            });
        }
    }),

    logout: asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
        // const uid = req.user.uid;
        const refreshToken = req.cookies['refreshToken'];
        try {
            const { uid } = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY) as User;

            res.clearCookie('refreshToken');
            await UserModel.findOneAndUpdate(
                { _id: uid },
                { $pull: { refreshToken: refreshToken }, $unset: { deviceToken: 1 } },
                { new: true }
            );
            res.status(200).json({ status: 'success', msg: 'logged out !' });
        } catch (error) {
            return res.status(403).json({ status: 'failed', msg: 'refresh token is not valid !' });
        }
    }),

    requestRefreshToken: asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken)
            return res.status(401).json({ status: 'failed', msg: 'you are not refreshToken !' });

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY) as User;
            const user = {
                role: decoded.role,
                _id: decoded.uid,
            };

            await UserModel.findOneAndUpdate(
                { _id: user._id },
                { $pull: { refreshToken: refreshToken } },
                { new: true }
            );

            const newAccessToken = generatorAccessToken(user);
            const newRefreshToken = generatorRefreshToken(user);

            await UserModel.findOneAndUpdate(
                { _id: user._id },
                { $push: { refreshTokens: newRefreshToken } },
                { new: true }
            );

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                path: '/',
                secure: false,
            });

            res.status(200).json({ status: 'success', data: newAccessToken });
        } catch (error) {
            return res.status(403).json({ status: 'failed', msg: 'refresh token is not valid !' });
        }
    }),
};

export default authController;
