import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const userModel = mongoose.model("users", userSchema);
