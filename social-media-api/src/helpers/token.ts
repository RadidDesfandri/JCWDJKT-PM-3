import { sign } from "jsonwebtoken";

interface TokenPayload {
  id: number;
  email: string;
  name?: string;
}

const SECRET_KEY = process.env.SECRET_KEY || "";

export const createToken = (payload: TokenPayload) => {
  return sign(payload, SECRET_KEY, { expiresIn: "2h" });
};
