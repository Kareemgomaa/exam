import mongoose, { Schema } from "mongoose";


const questionSchema = new Schema({
    session: { type: Schema.Types.ObjectId, ref: "sessions", required: false },
    text: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
}, { timestamps: true })

export const questionModel = mongoose.model("questions", questionSchema);