import mongoose, { Schema } from "mongoose";


const enrollmentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        required: false,
        default: 0,
        ref: "courses"
    }
    ,
    completedSessions: [{
        type: Schema.Types.ObjectId,
        ref: "sessions"
    }]
},
    {
        timestamps: true
    },
);

export const enrollmentModel = mongoose.model("enrollments", enrollmentSchema);