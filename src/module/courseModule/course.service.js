import { courseModel } from "../../dataBase/model/courses.model.js";

export const creatCourse = async (req, res) => {
    try {
        const { title, description, price, thumbnail, category } = req.body;
        const course = await courseModel.create({
            title,
            description,
            price,
            thumbnail,
            category,
            teacher: req.user._id
        });
        res.json({ message: "success", course });
    } catch (error) {
        res.json({ message: "Failed to create course", error: error.message });
    }
}
export const courseSearch = async (req, res) => {
    try {
        const { q, category, isFree, page, limit } = req.query;
        const query = {};
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }
        if (category) {
            query.category = category;
        }
        if (isFree) {
            query.price = 0;
        }
        const courses = await courseModel.find(query).skip((page - 1) * limit).limit(limit);
        res.json({ message: 'success', courses });
    } catch (error) {
        res.json({ message: 'Failed to retrieve courses', error: error.message });
    }
}
export const getCourseById = async (req, res) => {
    let { id } = req.params;
    let course = await courseModel.findById(id);
    if (!course) {
        return res.json({ message: "course not found" });
    }
    res.json({ message: "success", data: course });
}
export const editing = async (req, res) => {
    try {
        let { id } = req.params;
        let course = await courseModel.findById(id);
        if (!course) {
            return res.json({ message: "course not found" });
        }
        if (course.teacher.toString() !== req.user._id) {
            return res.json({ message: "you are not allowed to edit this course" });
        }
        let { title, description, price, thumbnail, category } = req.body;
        let courseupdated = await courseModel.findByIdAndUpdate(
            id,
            { title, description, price, thumbnail, category },
            { new: true }
        );
        res.json({ message: "success", data: courseupdated });
    } catch (error) {
        res.json({ message: "Error updating course", error: error.message });
    }
}
export const deleteCourse = (req, res) => {
    let { id } = req.params;
    let course = courseModel.findById(id);
    if (!course) {
        return res.json({ message: "course not found" });
    }
    if (course.teacher.toString() !== req.user._id) {
        return res.json({ message: "you are not allowed to delete this course" });
    }
    let coursedeleted = courseModel.deleteOne({ _id: id });
    if (!coursedeleted) {
        return res.json({ message: "course not deleted" });
    }
    res.json({ message: "success", data: course });
}
export const ownCourses = async (req, res) => {
    let ownCourses = await courseModel.find({ teacher: req.user._id });
    if (!ownCourses) {
        return res.json({ message: "courses not found" });
    }
    res.json({ message: "success", data: ownCourses });
}
