import mongoose from "mongoose";

const dataBaseConnection = () => {
    mongoose
        .connect("mongodb+srv://kareemgomaa2001_db_user:V8p7Akf3UvFsccf0@cluster0.makrpoj.mongodb.net/courseSystm")
        .then(() => console.log("data base connected"))
        .catch((err) => console.log(err));
};

export default dataBaseConnection;
