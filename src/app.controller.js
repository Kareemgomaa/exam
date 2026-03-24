import express from "express";
import dataBaseConnection from "./dataBase/connection.js";
import authRouter from "./module/authModule/auth.controller.js";
import userRouter from "./module/userModule/user.controller.js";
import coursesRouter from "./module/courseModule/course.controller.js";
import sessionRouter from "./module/sessionModule/session.controller.js";
import questionRouter from "./module/questionModule/question.controller.js";
import enrollRouter from "./module/enrollmentModule/enrollment.controller.js";
import adminRouter from "./module/admin/admin.controller.js";


const bootstrap = () => {
    let app = express();
    app.use(express.json());
    dataBaseConnection();
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/courses', coursesRouter)
    app.use('/sessions', sessionRouter)
    app.use('/questions', questionRouter)
    app.use('/enrollments', enrollRouter)
    app.use('/admin', adminRouter)
    app.listen(3000, () => {
        console.log("server 3000 open");
    });
};

export default bootstrap;
