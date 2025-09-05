import express, { Response, Request, Application } from "express";
import ExpenseRouteV1 from "./routers/expense-v1.router";

class Server {
  private port: number;
  private app: Application;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.routes();
    this.middlewares();
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("Welcome to expense tracker api");
    });

    this.app.use("/api", ExpenseRouteV1);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Application run on => http://localhost:${this.port}`);
    });
  }
}

const server = new Server(8000);
server.listen();
