require('dotenv').config();
import _ from 'cloudinary';

const cloudinary = _.v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinary;
