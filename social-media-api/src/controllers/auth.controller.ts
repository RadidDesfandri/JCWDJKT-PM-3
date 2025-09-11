import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Database } from "../config/prisma";
import { Login, Register } from "../types/user-type";

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

      // Jika tidak tersedia buat user baru
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password,
        },
        // Select untuk mengambil data yang diperlukan
        select: {
          id: true,
          name: true,
          email: true,
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
      const isValidPassword = user.password === password;

      // Return jika password salahF
      if (!isValidPassword) {
        return res.status(400).send({
          status: 400,
          msg: "Password salah",
        });
      }

      return res.json({
        status: 200,
        msg: "Login berhasil",
        token: crypto.randomUUID(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
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
