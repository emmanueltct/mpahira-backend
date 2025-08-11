// src/config/multer.ts
import multer from 'multer';

const storage = multer.memoryStorage(); // for buffer-based uploads

const upload = multer({ storage });

export default upload;
