import express from "express";
import { RegisterUser } from "../controllers/UserController.js";
import { GetAllUser } from "../controllers/UserController.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { VerifyUser } from "../controllers/UserController.js";
import { login } from "../controllers/UserController.js";
import { userPost } from "../controllers/UserController.js";
import { upload } from "../middleware/multer.middleware.js";
import { UserPost } from "../controllers/UserController.js";
import { comment } from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.get("/getalluser", verifyJwt, GetAllUser);
router.post("/verify", VerifyUser);
router.post("/login", login);
router.post(
  "/userpost",
  // verifyJwt,
  upload.fields([
    {
      name: "blog",
      maxCount: 4,
    },
  ]),
  userPost
);
router.post("/getuserdetails", verifyJwt, UserPost);
router.post("/addcomment", comment);
export default router;
// , verifyJwt