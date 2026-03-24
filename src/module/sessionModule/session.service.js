import { courseModel } from "../../dataBase/model/courses.model.js";
import { sessionModel } from "../../dataBase/model/session.model.js";
import { enrollmentModel } from "../../dataBase/model/enrollment.model.js";
import { Router } from "express";
import fs from "fs";

export const createSession = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.json({ message: "Course not found" });
        }
        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.json({ message: "You are not allowed to create a session for this course" });
        }
        const { title, order, contentType, filePath, duration } = req.body;
        const session = await sessionModel.create({ course: courseId, title, order, contentType, filePath, duration });
        res.json({ message: "Session created successfully. Now add questions to it.", data: session });
    } catch (error) {
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
}
export const getSessionByCourseId = async (req, res) => {
    try {
        let { courseId } = req.params;
        let course = await courseModel.findById(courseId);
        if (!course) return res.json({ message: "Course not found" });

        // Allow teacher (owner) or admin to view sessions without enrollment
        let isOwner = course.teacher.toString() === req.user._id.toString();
        let isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            let enrolleduser = await enrollmentModel.findOne({ student: req.user._id, course: courseId });
            if (!enrolleduser) {
                return res.json({ message: "You are not enrolled in this course" });
            }
        }

        let sessions = await sessionModel.find({ course: courseId });
        res.json({ message: "Sessions", data: sessions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching sessions", error: error.message });
    }
}
export const getSessionById = async (req, res) => {
    try {
        let { id } = req.params;
        let session = await sessionModel.findById(id);
        if (!session) {
            return res.json({ message: "session not found" });
        }
        
        const course = await courseModel.findById(session.course);
        let isOwner = course && course.teacher.toString() === req.user._id.toString();
        let isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            let enrolleduser = await enrollmentModel.findOne({ student: req.user._id, course: session.course });
            if (!enrolleduser) {
                return res.json({ message: "You are not enrolled in this course" });
            }
        }

        res.json({ message: "session", session });
    } catch (error) {
        res.status(500).json({ message: "Error fetching session", error: error.message });
    }
}
export const updateSession = async (req, res) => {
    try {
        let { id } = req.params;
        let session = await sessionModel.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const course = await courseModel.findById(session.course);
        if (!course || course.teacher.toString() !== req.user._id.toString()) {
            return res.json({ message: "You are not allowed to update this session" });
        }

        const { title, order, contentType, filePath, duration } = req.body;
        let updatedSession = await sessionModel.findByIdAndUpdate(
            id,
            { title, order, contentType, filePath, duration },
            { new: true });
        res.json({ message: "Session updated successfully", data: updatedSession });
    } catch (error) {
        res.status(500).json({ message: "Error updating session", error: error.message });
    }
}
export const deleteSession = async (req, res) => {
    try {
        let { id } = req.params;
        let session = await sessionModel.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const course = await courseModel.findById(session.course);
        if (!course || course.teacher.toString() !== req.user._id.toString()) {
            return res.json({ message: "You are not allowed to delete this session" });
        }
        await sessionModel.findByIdAndDelete(id);
        res.json({ message: "session deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting session", error: error.message });
    }
}
export const streamSessionVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await sessionModel.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const course = await courseModel.findById(session.course);
        if (!course) {
            return res.status(404).json({ message: "Course for this session not found" });
        }

        const user = req.user;
        let isOwner = course.teacher.toString() === user._id.toString();
        let isAdmin = user.role === 'admin';
        let isAuthorized = false;

        if (isOwner || isAdmin) {
            isAuthorized = true;
        } else {
            // Student checks
            const enrollment = await enrollmentModel.findOne({ student: user._id, course: course._id });
            if (!enrollment) {
                return res.status(403).json({ message: "You are not enrolled in this course." });
            }

            if (session.order > 1) {
                const previousSession = await sessionModel.findOne({ course: session.course, order: session.order - 1 });
                if (previousSession && !enrollment.completedSessions.includes(previousSession._id)) {
                    return res.status(403).json({ message: "You must complete the previous session's quiz to access this one." });
                }
            }
            isAuthorized = true;
        }
        if (!isAuthorized) {
            return res.status(403).json({ message: "You are not authorized to stream this video." });
        }

        if (session.contentType !== 'video') {
            return res.status(400).json({ message: "This session content is not a video." });
        }
        const videoPath = session.filePath;
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ message: "Video file not found on server." });
        }
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
                return;
            }

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = { 'Content-Length': fileSize, 'Content-Type': 'video/mp4' };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        res.status(500).json({ message: "Error streaming video", error: error.message });
    }
}
export const downloadPdf = async (req, res) => {
    try {
        let { id } = req.params;
        const session = await sessionModel.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const user = req.user;
        const course = await courseModel.findById(session.course);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const isOwner = course.teacher.toString() === user._id.toString();
        const isAdmin = user.role === 'admin';

        // Allow owner or admin immediately
        if (isOwner || isAdmin) {
            return res.download(session.filePath);
        }

        // Logic for students
        const enrollment = await enrollmentModel.findOne({ student: user._id, course: session.course });
        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course." });
        }

        if (session.order > 1) {
            const previousSession = await sessionModel.findOne({ course: session.course, order: session.order - 1 });
            if (previousSession && !enrollment.completedSessions.includes(previousSession._id)) {
                return res.status(403).json({ message: "You must complete the previous session's quiz to access this one." });
            }
        }

        res.download(session.filePath);
    } catch (error) {
        res.status(500).json({ message: "Error downloading PDF", error: error.message });
    }
}
