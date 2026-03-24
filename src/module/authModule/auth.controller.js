import { Router } from "express";
import { loginSchema, registerSchema } from "../../middleware/validation/auth.validate.js";
import { validate } from "../../middleware/validation/validator.js";
import { login } from "./auth.service.js";
import { register } from "./auth.service.js";

let authRouter = Router();
authRouter.post("/register", validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)

export default authRouter;