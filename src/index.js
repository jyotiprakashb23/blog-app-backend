import app from "./app.js";
import dotenv from "dotenv";
import { ConnectDb } from "./DataBase/DbConnect.js";
dotenv.config();

ConnectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is listning on port ${process.env.PORT}`);
      console.log("But to the outside world port 8000 is exposed.")
    });
  })
  .catch((err) => {
    console.log("something went wrong in index.js", err);
  });
