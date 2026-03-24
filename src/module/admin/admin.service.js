import { courseModel } from "../../dataBase/model/courses.model.js";
import { enrollmentModel } from "../../dataBase/model/enrollment.model.js";
import { userModel } from "../../dataBase/model/users.model.js";

export const adminDashBoard = async (req, res) => {
    let totalUsers = await userModel.countDocuments();
    let totalCourses = await courseModel.countDocuments();
    let courses = await courseModel.find();
    let enrollments = await enrollmentModel.find();

    let revenue = 0;
    if (!enrollments) {
        return res.status(404).json({ message: "Enrollments not found still not revenue" });
    }
    for (let i = 0; i < enrollments.length; i++) {
        revenue += enrollments[i].totalPrice;
    }
    res.json({ totalUsers, totalCourses, courses, enrollments, revenue })


}