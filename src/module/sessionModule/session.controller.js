import { Router } from "express";
import { validate } from "../../middleware/validation/validator.js";
import { sessionSchemaValidation } from "../../middleware/validation/session.validate.js";
import { uploadSessionFile } from "../../middleware/multer.js";
import { allowedRoles } from "../../middleware/auth.js";
import { courseModel } from "../../dataBase/model/courses.model.js";
import { sessionModel } from "../../dataBase/model/session.model.js";
import { createSession, deleteSession, downloadPdf, getSessionByCourseId, getSessionById, streamSessionVideo, updateSession } from "./session.service.js";

let sessionRouter = Router();


sessionRouter.post('/create-session/:courseId', allowedRoles(["teacher"]), uploadSessionFile.single('file'),
    (req, res, next) => {
        if (req.file) {
            req.body.filePath = req.file.path;
            if (!req.body.contentType) req.body.contentType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'video';
        }
        next();
    },
    validate(sessionSchemaValidation),
    createSession)
sessionRouter.get('/get-sessions/:courseId', getSessionByCourseId)
sessionRouter.get('/get-session-data/:id', getSessionById)
sessionRouter.put('/update-session/:id', allowedRoles(["teacher"]), uploadSessionFile.single('file'),
    (req, res, next) => {
        if (req.file) {
            req.body.filePath = req.file.path;
            if (!req.body.contentType) req.body.contentType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'video';
        }
        next();
    },
    validate(sessionSchemaValidation), updateSession)
sessionRouter.delete('/delete-session/:id', allowedRoles(["teacher"]), deleteSession)
sessionRouter.get('/:id/stream', allowedRoles(["user", "teacher", "admin"]), streamSessionVideo)
sessionRouter.get('/downloads-pdf/:id', allowedRoles(["teacher", "admin", "user"]), downloadPdf)



export default sessionRouter;



