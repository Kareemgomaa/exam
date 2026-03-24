import { Router } from "express";
import { allowedRoles, auth } from "../../middleware/auth.js";
import { userModel } from "../../dataBase/model/users.model.js";
import { ban, deleteUser, getAllUsera, getUserById, unBan } from "./user.service.js";

let userRouter = Router();


userRouter.get('/users', auth, allowedRoles(["admin"]), getAllUsera)
userRouter.get('/user-by-id/:id', auth, allowedRoles(["admin"]), getUserById)
userRouter.patch('/:id/ban', auth, allowedRoles(["admin"]), ban)
userRouter.patch('/:id/unBan', auth, allowedRoles(["admin"]), unBan)
userRouter.delete('/delete/:id', auth, allowedRoles(["admin"]), deleteUser)

export default userRouter;
