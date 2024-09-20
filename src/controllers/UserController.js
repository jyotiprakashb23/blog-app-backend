import userModel from "../models/UserModel.js";
import { GenerateJwt } from "../helper/GenerateToken.js";
import { SendEmail } from "../helper/EmailTemplate.js";
import bcrypt from "bcryptjs";
import { uploadOnCloudinary } from "../helper/ClaudinaryUpload.js";
import postModel from "../models/PostModel.js";
import CommentModel from "../models/CommentModel.js";

export const RegisterUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email) {
      return res.status(400).json({ message: "Provide all details please" });
    }

    const checkUnique = await userModel.findOne({ email });
    if (checkUnique) {
      return res.status(400).json({ message: "User should be unique" });
    }
    const NewPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const emilSend = await SendEmail(email, verificationCode);

    const newUser = new userModel({
      name,
      email,
      password: NewPassword,
      verificationCode,
    });
    await newUser.save();
    return res.status(200).json({ message: "user registered succesfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetAllUser = async (req, res) => {
  try {
    const allUsers = await userModel.find({});
    return res
      .status(200)
      .json({ data: allUsers, message: "data successflly fetched" });
  } catch (error) {
    console.log("something went wrong while getting all user", error);
  }
};

export const VerifyUser = async (req, res) => {
  try {
    const { email, verifyCode } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }
    const checkVerificationCodeMatch = user.verificationCode === verifyCode;
    if (!checkVerificationCodeMatch) {
      return res
        .status(400)
        .json({ message: "Verification code does not match" });
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).json({ message: "user verified successfully" });
  } catch (error) {}
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await userModel.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!foundUser.isVerified) {
      return res.status(400).json({ message: "User is not verified" });
    }
    const ValidUser = await bcrypt.compare(password, foundUser.password);
    if (!ValidUser) {
      return res.status(400).json({ message: "Password does not match" });
    }
    const token = GenerateJwt(foundUser._id);
    return res
      .status(200)
      .json({ data: foundUser, token: token, message: "Login successfully" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userPost = async (req, res) => {
  try {
    const { postname, userid } = req.body;
    const images = req.files?.blog;
    console.log(postname,userid,images);

    if (!userid) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }
    const user = await userModel.findById(userid);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (!postname || !images) {
      return res.status(400).json({
        message: "Post name and images are required",
      });
    }
    let imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      let result = await uploadOnCloudinary(images[i].path);
      imageUrls.push(result.url);
    }
    // Create a new post
    const newPost = new postModel({ postname, url: imageUrls });
    await newPost.save();
    // Add the post reference to the user's posts array
    user.posts.push(newPost._id);
    await user.save(); // Save the updated user document
    return res.status(200).json({
      message: "Post created successfully",
      post: newPost,
      user,
    });
  } catch (error) {
    console.error("Something went wrong while uploading", error);
    res.status(500).json({
      message: "Failed to upload post",
      error: error.message,
    });
  }
};

export const UserPost = async (req, res) => {
  try {
    const { userid } = req.body;

    if (!userid) {
      return res.status(400).json({ message: "User ID is required.." });
    }

    // Find user by ID and populate the 'posts' array with the actual post documents
    const user = await userModel.findById(userid).populate("posts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user, message: "User fetched successfully" });
  } catch (error) {
    console.log("Something went wrong while fetching user data", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const comment = async (req, res) => {
  try {
    const { text, postid, userid } = req.body;

    if (!postid) {
      return res.status(400).json({ message: "Please provide post ID" });
    }
    if (!userid) {
      return res.status(400).json({ message: "Please provide a user ID" });
    }

    // Fetch the post using the post ID directly as a string
    const postedPhoto = await postModel.findById(postid);
    if (!postedPhoto) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await userModel.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new comment
    const newComment = new CommentModel({ text });
    await newComment.save();

    // Add the comment ID to the user's comments array
    user.comments.push(newComment._id);
    await user.save();

    // Ensure that the Comment field is initialized as an array
    // if (!Array.isArray(postedPhoto.Comment)) {
    //   postedPhoto.Comment = []; // Initialize it as an empty array if undefined
    // }

    // Add the comment ID to the post's comments array
    postedPhoto.Comment.push(newComment._id); // Push the new comment's _id
    await postedPhoto.save();

    return res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Something went wrong while commenting", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


