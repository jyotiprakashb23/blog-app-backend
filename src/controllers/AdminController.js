import userModel from "../models/UserModel.js";

export const AllUsers = async (req, res) => {
  try {
    const allUser = await userModel.find().populate("posts");
    return res.status(200).json({ data: allUser, message: "here is all user" });
  } catch (error) {}
};
