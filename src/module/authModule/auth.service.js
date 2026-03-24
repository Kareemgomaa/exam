import { auth, generateToken } from "../../middleware/auth.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../../dataBase/model/users.model.js";

export const register = async (req, res) => {
    let { email, password, name, role, cardNumber } = req.body;
    let userSearch = await userModel.findOne({ email });
    if (userSearch) {
        return res.json({ message: "user already exist" });
    }
    if (role != "user" && role != "admin" && role != "teacher") {
        return res.json({ message: "role must be member or admin" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    let user = await userModel.insertMany({
        name,
        email,
        password: hashedPassword,
        role,
    });
    if (user) {
        res.json({ message: "success", user: user });
    } else {
        res.json({ message: "fail" });
    }

}
export const login = async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        return res.json({ message: "user not found" });
    }
    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.json({ message: "password not match" });
    }
    let token = generateToken(user);
    res.json({ message: "success", user, token });
}