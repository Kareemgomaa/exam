import { Router } from "express";
import { allowedRoles } from "../../middleware/auth.js";
import { courseSearch, creatCourse, deleteCourse, editing, getCourseById, ownCourses } from "./course.service.js";
import { validate } from "../../middleware/validation/validator.js";
import { courseSchema } from "../../middleware/validation/course.validate.js";


let courseRouter = Router();
courseRouter.post('/create-course', allowedRoles(["teacher"]), validate(courseSchema), creatCourse);
courseRouter.get('/courses/search', courseSearch)
courseRouter.get('/course-by-id/:id', getCourseById)
courseRouter.patch('/edit-course/:id', allowedRoles(["teacher"]), validate(courseSchema), editing)
courseRouter.delete('/delete-course/:id', allowedRoles(["teacher"]), deleteCourse)
courseRouter.get('/get-teacher-courses', allowedRoles(["teacher"]), ownCourses)
export default courseRouter;