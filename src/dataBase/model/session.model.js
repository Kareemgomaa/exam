import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "courses", required: false },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    contentType: { type: String, enum: ["video", "pdf"], required: true },
    filePath: { type: String, required: true },
    duration: { type: Number, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "questions" }],
});

export const sessionModel = mongoose.model("sessions", sessionSchema); 