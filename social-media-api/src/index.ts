import express, { Application, Request, Response } from "express";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import postRouter from "./routers/post.router";
import cors from "cors";

class Server {
  private port: number;
  private app: Application;

  constructor(port: number) {
    this.port = port;
    this.app = express();

    this.middlewares();

    this.routes();
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("Welcome to social media api");
    });

    this.app.use("/api/auth", authRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/posts", postRouter);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Application run on => http://localhost:${this.port}`);
    });
  }
}

const server = new Server(8000);
server.listen();
