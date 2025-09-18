import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Database } from "../config/prisma";
import { Login, Register } from "../types/user-type";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { createToken } from "../helpers/token";

class AuthController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new Database().getInstance();
  }

  public register = async (req: Request, res: Response) => {
    try {
      const { email, name, password }: Register = req.body;

      if (!email || !name || !password) {
        return res.status(400).send({
          status: 400,
          msg: "Email, Name, dan Password wajib diisi",
        });
      }

      // Untuk periksa apakah email yang di input user tersedia
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      // Jika tersedia beri error
      if (existingUser) {
        return res.status(400).send({
          status: 400,
          msg: "User dengan email tersebut sudah tersedia, mohon ganti email",
        });
      }

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      // Jika tidak tersedia buat user baru
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashPassword,
          avatar: `https://ui-avatars.com//api//?name=${name}&color=FFFFFF&background=2e2e2e&length=1`,
        },
        // Select untuk mengambil data yang diperlukan
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      });

      return res.json({
        status: 200,
        msg: "Berhasil register",
        user,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password }: Login = req.body;

      if (!email || !password) {
        return res.status(400).send({
          status: 400,
          msg: "Email dan Password wajib diisi",
        });
      }

      // Cari user berdasarkan email
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      // Jika tidak kirim response 404
      if (!user) {
        return res.status(404).send({
          status: 404,
          msg: "User tidak ditemukan",
        });
      }

      // Periksa apakah password database sama dengan password yang dimasukkan user
      const isValidPassword = await compare(password, user.password);

      // Return jika password salahF
      if (!isValidPassword) {
        return res.status(400).send({
          status: 400,
          msg: "Password salah",
        });
      }

      const jwtPayload = { id: user.id, email: user.email };
      const token = createToken(jwtPayload);

      return res.json({
        status: 200,
        msg: "Login berhasil",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        token,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };
}

export default AuthController;
