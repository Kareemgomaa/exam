import { Router } from "express";
import { allowedRoles } from "../../middleware/auth.js";
import { userModel } from "../../dataBase/model/users.model.js";
import { courseModel } from "../../dataBase/model/courses.model.js";
import { enrollmentModel } from "../../dataBase/model/enrollment.model.js";
import { adminDashBoard } from "./admin.service.js";

let adminRouter = Router();

adminRouter.get('/admin-view', allowedRoles(["admin"]), adminDashBoard)


export default adminRouter;
