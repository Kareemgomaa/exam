import { Router } from "express";
import { allowedRoles } from "../../middleware/auth.js";
import { courseModel } from "../../dataBase/model/courses.model.js";
import { enrollmentModel } from "../../dataBase/model/enrollment.model.js";
import { userModel } from "../../dataBase/model/users.model.js";
import { enrollment, listCourses } from "./enrollment.service.js";

let enrollRouter = Router();
enrollRouter.post('/course-enroll/:courseId', allowedRoles(["user"]), enrollment)
enrollRouter.get('/courses-enroll', allowedRoles(["user"]), listCourses)
export default enrollRouter;
