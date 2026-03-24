import joi from "joi";

export const questionSchemaValidation = joi.object({
    session: joi.string(),
    text: joi.string().required(),
    options: joi.array().items(joi.string()).required(),
    correctAnswerIndex: joi.number().required(),
})