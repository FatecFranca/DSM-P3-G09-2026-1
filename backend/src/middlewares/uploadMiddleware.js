import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const upload = multer({ storage });

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'produtos',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

export default upload;