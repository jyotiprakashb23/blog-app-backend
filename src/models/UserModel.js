import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    isVerifiedExpiry: {
      type: Date,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "postModel",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommentModel",
      },
    ],
  },
  { timeseries: true }
);

const userModel = new mongoose.model("userModel", userSchema);
export default userModel;
