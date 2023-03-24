import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import router from './routes';
import errorHandler from './handlers/errorHandler';
import connectDB from './utils/connectDB';
import scheduleService from './services/scheduleService';

dotenv.config();

const app = express();

//middleware

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

//database
connectDB();

//routes
app.use('/api', router);
app.use(errorHandler);

scheduleService.reSchedules();
//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('App is running on PORT: ' + PORT);
});
