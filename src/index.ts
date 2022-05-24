import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './routes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//database
const MONGO_URL = process.env.MONGODB_URL;
mongoose
    .connect(MONGO_URL, { autoIndex: false })
    .then(() => console.log('Connect MongoDB successfully !'))
    .catch((error) => console.log(error));

//routes
app.use('/api', router);

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('App is running on PORT: ' + PORT);
});