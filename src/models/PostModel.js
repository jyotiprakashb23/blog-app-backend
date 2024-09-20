import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  postname: {
    type: String,
  },
  url: [
    {
      type: String,
    },
  ],
  like: {
    type: Number,
    default: 0,
  },
  Comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentModel",
    },
  ],
});

const postModel = new mongoose.model("postModel", postSchema);
export default postModel;
