import express from "express";
import UserInfo from "./routes/User.router.js";
import AdminInfo from "./routes/Admin.route.js";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/user-info", UserInfo);
app.use("/api/v1/admin-info", AdminInfo);
app.use("/",(req,res)=>{
    return res.send("Hii, Welcome to our application")
})

export default app;
