import mongoose from "mongoose";

const commentSchma = new mongoose.Schema(
  {
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const CommentModel = new mongoose.model("CommentModel", commentSchma);
export default CommentModel;
