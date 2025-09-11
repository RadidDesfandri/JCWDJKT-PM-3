import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Database } from "../config/prisma";

class UserController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new Database().getInstance();
  }

  public all = async (req: Request, res: Response) => {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          created_at: true,
        },
      });

      return res.json({
        status: 200,
        data: users,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public detail = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
          id: true,
          email: true,
          name: true,
          created_at: true,
        },
      });

      if (!user) {
        return res.status(404).send({
          status: 404,
          msg: "User tidak ditemukan",
        });
      }

      return res.json({
        status: 200,
        data: user,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { name } = req.body;

      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return res.status(404).send({
          status: 404,
          msg: "User tidak ditemukan",
        });
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: Number(userId) },
        data: { name },
        select: {
          id: true,
          email: true,
          name: true,
          created_at: true,
        },
      });

      return res.json({
        status: 200,
        msg: "Berhasil update user",
        data: updatedUser,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public getUserPost = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);

      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return res.status(404).send({
          status: 404,
          msg: "User tidak ditemukan",
        });
      }

      const posts = await this.prisma.post.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      return res.json({
        status: 200,
        data: posts,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  // sendMailVerif & OTP -> /user/verif
  // checkOtp -> /user/check-otp
  // updateEmail -> /user/update-email

  // updatePassword

  //   public login = async (req: Request, res: Response) => {
  //     try {
  //       return res.json({
  //         status: 200,
  //         msg: "Hit api",
  //       });
  //     } catch (error) {
  //       console.log("Error:", error);
  //       return res.status(500).send({
  //         status: 500,
  //         msg: `Error: ${error}`,
  //       });
  //     }
  //   };
}

export default UserController;
