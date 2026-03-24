import Joi from "joi";

export const sessionSchemaValidation = Joi.object({
    course: Joi.string(),
    title: Joi.string().required(),
    order: Joi.number().required(),
    contentType: Joi.string().valid('video', 'pdf').required(),
    filePath: Joi.string().required(),
    duration: Joi.number().required(),
    questions: Joi.array().items(Joi.string()).optional(),
})