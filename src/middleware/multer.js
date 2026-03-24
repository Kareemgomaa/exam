import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';

const videoDir = path.join('uploads', 'videos');
const pdfDir = path.join('uploads', 'pdfs');

if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, pdfDir);
        } else {
            cb(null, videoDir);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const videoFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["video/mp4", "video/mkv", "video/webm", "video/x-matroska"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only MP4, MKV, and WEBM videos are allowed."), false);
    }
};


const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF files are allowed."), false);
    }
};

const sessionFileFilter = (req, file, cb) => {
    const allowedVideoTypes = ["video/mp4", "video/mkv", "video/webm", "video/x-matroska"];
    const allowedPdfTypes = ["application/pdf"];
    if (file.mimetype === "application/pdf" || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF and Video files are allowed."), false);
    }
};

export const uploadVideo = multer({
    storage: storage,
    fileFilter: videoFileFilter,
    limits: { fileSize: 500 * 1024 * 1024 }
});



export const uploadPdf = multer({
    storage: storage,
    fileFilter: pdfFileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }
})


export const uploadSessionFile = multer({
    storage: storage,
    fileFilter: sessionFileFilter,
    limits: { fileSize: 500 * 1024 * 1024 }
});















