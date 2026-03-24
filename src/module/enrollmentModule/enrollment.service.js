import { courseModel } from "../../dataBase/model/courses.model.js";
import { enrollmentModel } from "../../dataBase/model/enrollment.model.js";
import { userModel } from "../../dataBase/model/users.model.js";

export const enrollment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.courses.includes(courseId)) {
            return res.status(400).json({ message: "You are already enrolled in this course." });
        }

        const enrollment = await enrollmentModel.create({
            totalPrice: course.price,
            student: user._id,
            course: courseId,
        });

        user.courses.push(courseId);
        await user.save();

        res.status(201).json({ message: "Course enrolled successfully", user, course, enrollment });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during enrollment.", error: error.message });
    }
}
export const listCourses = async (req, res) => {
    let userid = req.user._id
    let user = await userModel.findById(userid).populate("courses");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.courses.length < 1) {
        res.json({ message: "you are not enrolled in any courses" })
    }
    res.json({ courses: user.courses });


}