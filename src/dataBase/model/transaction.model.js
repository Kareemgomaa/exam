import mongoose, { Schema } from "mongoose";
const transactionSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: true
    }
);

export const transactionModel = mongoose.model("transactions", transactionSchema);