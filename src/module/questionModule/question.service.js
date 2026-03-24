import { questionModel } from "../../dataBase/model/question.model.js";
import { sessionModel } from "../../dataBase/model/session.model.js";

export const createQuestion = async (req, res) => {
    try {
        let { text, options, correctAnswerIndex } = req.body;
        let { sessionId } = req.params

        let session = await sessionModel.findById(sessionId).populate({
            path: 'course',
            select: 'teacher'
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.course.teacher.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to add questions to this session" });
        }

        const question = await questionModel.create({ session: sessionId, text, options, correctAnswerIndex, teacher: req.user._id });

        await sessionModel.findByIdAndUpdate(sessionId, { $push: { questions: question._id } });
        res.status(201).json({ message: "Question created and linked to session successfully", question });
    } catch (error) {
        res.status(500).json({ message: "Error creating question", error: error.message });
    }
}
export const getQuestions = async (req, res) => {
    let { sessionId } = req.params;
    let session = await sessionModel.findById(sessionId).populate('questions');
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ message: "Questions retrieved successfully", questions: session.questions });
}
export const upadteQuestion = async (req, res) => {
    let { id } = req.params;
    let { text, options, correctAnswerIndex } = req.body;
    let question = await questionModel.findById(id);

    if (!question) {
        return res.status(404).json({ message: "question not found" });
    }

    if (question.teacher.toString() !== req.user._id) {
        return res.status(403).json({ message: "you can not update this question" });
    }
    question.text = text;
    question.options = options;
    question.correctAnswerIndex = correctAnswerIndex;
    await question.save();
    res.status(200).json({ message: "question updated successfully", question });
}
export const deleteQuestion = async (req, res) => {
    let { id } = req.params;
    let question = await questionModel.findById(id);
    if (!question) {
        return res.status(404).json({ message: "question not found" });
    }
    if (question.teacher.toString() !== req.user._id) {
        return res.status(403).json({ message: "you can not delete this question" });
    }
    await questionModel.findByIdAndDelete(id);
    await sessionModel.findByIdAndUpdate(question.session, { $pull: { questions: id } });
    res.status(200).json({ message: "question deleted successfully" });
}
export const answerQuestion = async (req, res) => {
    let { sessionId } = req.params;
    let { questionId, answerIndex } = req.body;
    let session = await sessionModel.findById(sessionId).populate('questions');
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    let question = await questionModel.findById(questionId);
    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }
    if (answerIndex !== question.correctAnswerIndex) {
        return res.status(400).json({ message: "Incorrect answer" });
    }
    res.status(200).json({ message: "Correct answer" });
    session.completedQuestions.push(questionId);
    await session.save();
    await questionModel.findByIdAndDelete(questionId);
    await sessionModel.findByIdAndUpdate(sessionId, { $pull: { questions: questionId } });
    res.status(200).json({ message: "Question answered successfully" });
}