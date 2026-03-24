
import mongoose, { Schema } from "mongoose";


const courseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "users", required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String, required: true },

})

export const courseModel = mongoose.model("courses", courseSchema);