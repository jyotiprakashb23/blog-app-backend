import jwt from "jsonwebtoken";

export const GenerateJwt = (userid) => {
  return jwt.sign({ userid }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};
