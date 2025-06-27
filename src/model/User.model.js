import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Username is Required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    match: [`^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`, "Please use valid Email"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  verifyCode: {
    type: String,
    required: [true, "VerifyCode is Required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "VerifyCode Expiry is Required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
