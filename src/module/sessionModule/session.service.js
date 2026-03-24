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
        if (course.teacher.toString() !== req.user._id) {
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
    let { courseId } = req.params;
    let course = await courseModel.findById(courseId);
    let enrolleduser = await enrollmentModel.findOne({ student: req.user._id, course: courseId });
    if (!enrolleduser) {
        return res.json({ message: "You are not enrolled in this course" });
    }
    if (!course) return res.json({ message: "Course not found" });
    let sessions = await sessionModel.find({ course: courseId });
    res.json({ message: "Sessions", data: sessions });

}
export const getSessionById = async (req, res) => {
    let { id } = req.params;
    let session = await sessionModel.findById(id)
    if (!session) {
        return res.json({ messege: "session not found" })
    }
    let enrolleduser = await enrollmentModel.findOne({ student: req.user._id, course: session.course });
    if (!enrolleduser) {
        return res.json({ message: "You are not enrolled in this course" });
    }

    res.json({ messege: "session", session })
}
export const updateSession = async (req, res) => {
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

}
export const deleteSession = async (req, res) => {
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
    res.json({ message: "session deleted successfully" })
}
export const streamSessionVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await sessionModel.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.order > 1) {
            const enrollment = await enrollmentModel.findOne({ student: req.user._id, course: session.course });
            if (!enrollment) {
                return res.status(403).json({ message: "You are not enrolled in this course." });
            }

            const previousSession = await sessionModel.findOne({ course: session.course, order: session.order - 1 });
            if (previousSession && !enrollment.completedSessions.includes(previousSession._id)) {
                return res.status(403).json({ message: "You must complete the previous session's quiz to access this one." });
            }
        }

        const user = req.user;
        let enrolleduser = await enrollmentModel.findOne({ student: user._id, course: session.course });
        if (user.role === 'user' && !enrolleduser) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        const course = await courseModel.findById(session.course);
        if (!course) {
            return res.status(404).json({ message: "Course for this session not found" });
        }
        let isAuthorized = false;
        if (user.role === 'admin' || (user.role === 'teacher' && course.teacher.toString() === user._id.toString())) {
            isAuthorized = true;
        } else if (user.role === 'user') {
            const enrollment = await enrollmentModel.findOne({ student: user._id, course: course._id });
            if (enrollment) {
                isAuthorized = true;
            }
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
    let { id } = req.params;
    const session = await sessionModel.findById(id);
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }

    if (session.order > 1) {
        const enrollment = await enrollmentModel.findOne({ student: req.user._id, course: session.course });
        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course." });
        }

        const previousSession = await sessionModel.findOne({ course: session.course, order: session.order - 1 });
        if (previousSession && !enrollment.completedSessions.includes(previousSession._id)) {
            return res.status(403).json({ message: "You must complete the previous session's quiz to access this one." });
        }
    }

    const user = req.user;
    const course = await courseModel.findById(session.course);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    const isEnrolled = await enrollmentModel.findOne({ student: user._id, course: session.course });
    const isOwner = course.teacher.toString() === user._id.toString();

    if (user.role === 'admin' || (user.role === 'teacher' && isOwner) || (user.role === 'user' && isEnrolled)) {
        res.download(session.filePath);
    } else {
        return res.status(403).json({ message: "You don't have permission to download this file" });
    }
}
