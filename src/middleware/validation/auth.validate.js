import joi from "joi";

export const registerSchema = joi.object({
    name: joi.string().required().min(2).max(50).messages({
        "string.empty": "Name is required",
        "string.min": "Name should be at least 2 characters",
        "string.max": "Name should not exceed 50 characters",
        "any.required": "Name is required",
    }),
    email: joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: joi.string().required().min(8).pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d).+$")).messages({
        "string.empty": "Password is required",
        "string.min": "Password should be at least 8 characters",
        "string.pattern.base": "Password must contain at least one uppercase letter and one number",
        "any.required": "Password is required",
    }),
    role: joi.string().valid("user", "admin", "teacher").required().messages({
        "string.empty": "Role is required",
        "any.only": "Role must be one of 'user', 'admin', or 'teacher'",
        "any.required": "Role is required",
    }),
    cardNumber: joi.string().min(16).pattern(/^[0-9]+$/).messages({
        "string.min": "Card number should be 16 digits",
        "string.pattern.base": "Card number should only contain digits",
        "any.required": "Card number is required",
    }),
})

export const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: joi.string().required().min(8).pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d).+$")).messages({
        "string.empty": "Password is required",
        "string.min": "Password should be at least 8 characters",
        "string.pattern.base": "Password must contain at least one uppercase letter and one number",
        "any.required": "Password is required",
    }),
})
