import { PrismaClient } from "@prisma/client";
import express, { Application, Request, Response } from "express";
import { Database } from "./config/prisma";

class Server {
  private port: number;
  private app: Application;
  private prisma: PrismaClient;

  constructor(port: number) {
    this.port = port;
    this.app = express();

    this.middlewares();

    this.routes();
    this.prisma = new Database().getInstance();
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("Welcome to social media api");
    });

    this.app.get("/user", async (req: Request, res: Response) => {
      //   const user = await this.prisma.user.create({
      //     data: {
      //       email: "radid@gmail.com",
      //       password: "1234567",
      //     },
      //   });

      const user = await this.prisma.user.findMany();

      res.status(200).send({
        status: 200,
        msg: "create user",
        user,
      });
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Application run on => http://localhost:${this.port}`);
    });
  }
}

const server = new Server(8000);
server.listen();
