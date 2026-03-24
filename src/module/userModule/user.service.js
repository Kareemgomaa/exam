import { userModel } from "../../dataBase/model/users.model.js";

export const getAllUsera = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json({ message: "Success", data: users });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve users", error: error.message });
    }
}
export const getUserById = async (req, res) => {
    let { id } = req.params;
    let user = await userModel.findById(id);
    if (!user) {
        return res.json({ message: "user not found" });
    }
    res.json({ message: "success", data: user });
}
export const ban = async (req, res) => {
    let { id } = req.params;
    let user = await userModel.findById(id);
    if (!user) {
        return res.json({ message: "user not found" });
    }
    if (user.isActive == false) {
        return res.json({ message: "user already banned" });
    }
    let userupdated = await userModel.updateOne({ _id: id }, { isActive: !user.isActive });
    if (!userupdated) {
        return res.json({ message: "user not updated" });
    }
    res.json({ message: "success", data: user });
}
export const unBan = async (req, res) => {
    let { id } = req.params;
    let user = await userModel.findById(id);
    if (!user) {
        return res.json({ message: "user not found" });
    }
    if (user.isActive == true) {
        return res.json({ message: "user already unbanned" });
    }
    let userupdated = await userModel.updateOne({ _id: id }, { isActive: !user.isActive });
    res.json({ message: "success", data: user });

}
export const deleteUser = async (req, res) => {
    let { id } = req.params;
    let user = await userModel.findById(id);
    if (!user) {
        return res.json({ message: "user not found" });
    }
    let userdeleted = await userModel.deleteOne({ _id: id });
    if (!userdeleted) {
        return res.json({ message: "user not deleted" });
    }
    res.json({ message: "success", data: user });

}
