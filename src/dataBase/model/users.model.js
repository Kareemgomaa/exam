import mongoose, { Schema } from "mongoose";


const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["user", "admin", "teacher"],
            default: "user",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        cardNumber: {
            type: String,
            required: function () {
                return this.role === 'teacher'
            },
            unique: true,
            sparse: true
        },
        profilePicture: {
            type: String,
            required: false
        },
        courses: [{
            type: Schema.Types.ObjectId,
            ref: "courses"
        }],
    },
    { timestamps: true },
);

export const userModel = mongoose.model("users", userSchema);
