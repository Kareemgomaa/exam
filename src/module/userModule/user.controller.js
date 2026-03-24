import { Router } from "express";
import { allowedRoles } from "../../middleware/auth.js";
import { userModel } from "../../dataBase/model/users.model.js";
import { ban, deleteUser, getAllUsera, getUserById, unBan } from "./user.service.js";

let userRouter = Router();


userRouter.get('/users', allowedRoles(["admin"]), getAllUsera)
userRouter.get('/user-by-id/:id', allowedRoles(["admin"]), getUserById)
userRouter.patch('/:id/ban', allowedRoles(["admin"]), ban)
userRouter.patch('/:id/unBan', allowedRoles(["admin"]), unBan)
userRouter.delete('/delete/:id', allowedRoles(["admin"]), deleteUser)

export default userRouter;
