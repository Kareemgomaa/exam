import joi from "joi";


export const courseSchema = joi.object({
    title: joi.string().required().min(2).max(50).messages({
        "string.empty": "Title is required",
        "string.min": "Title should be at least 2 characters",
        "string.max": "Title should not exceed 50 characters",
        "any.required": "Title is required",
    }),
    description: joi.string().required().min(2).max(50).messages({
        "string.empty": "Description is required",
        "string.min": "Description should be at least 2 characters",
        "string.max": "Description should not exceed 50 characters",
        "any.required": "Description is required",
    }),
    price: joi.number().required().min(0).messages({
        "number.base": "Price must be a number",
        "number.min": "Price should be greater than or equal to 0",
        "any.required": "Price is required",
    }),
    thumbnail: joi.string().required().messages({
        "string.empty": "Thumbnail is required",
        "any.required": "Thumbnail is required",
    }),
    category: joi.string().required().messages({
        "string.empty": "Category is required",
        "any.required": "Category is required",
    }),

})