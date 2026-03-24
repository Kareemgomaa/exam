import { Router } from "express";
import { validate } from "../../middleware/validation/validator.js";
import { questionSchemaValidation } from "../../middleware/validation/question.validate.js";
import { allowedRoles, auth } from "../../middleware/auth.js";
import { answerQuestion, createQuestion, deleteQuestion, getQuestions, upadteQuestion } from "./question.service.js";


let questionRouter = Router();
questionRouter.post('/create-questions/:sessionId', validate(questionSchemaValidation), allowedRoles(['teacher']), createQuestion);
questionRouter.get('/get-questions/:sessionId',auth, allowedRoles(["user", "admin", "teacher"]), getQuestions)
questionRouter.put('/update-question/:id',auth, allowedRoles(["teacher"]), upadteQuestion)
questionRouter.delete('/delete-question/:id',auth, allowedRoles(["teacher"]), deleteQuestion)
questionRouter.post('/answer-question/:sessionId',auth, allowedRoles(["user"]), answerQuestion)



export default questionRouter;
