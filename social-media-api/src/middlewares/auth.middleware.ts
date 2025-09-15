import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "";

type User = {
  id: number;
  email: string;
  name: string;
};

class AuthMiddleware {
  public verifyUserToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.replace("Bearer ", "");

      if (!token) {
        return res.status(400).send({
          status: 400,
          msg: "Access Token diperlukan",
        });
      }

      const verifyUser = verify(token, SECRET_KEY);

      if (!verifyUser) {
        return res.status(400).send({
          status: 400,
          msg: "Unauthorized",
        });
      }

      req.user = verifyUser as User;

      next();
    } catch (error) {
      console.log("Middleware Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error middleware ${error}`,
      });
    }
  };
}

export default AuthMiddleware;
