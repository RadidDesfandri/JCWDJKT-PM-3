import express, { Response, Request, Application } from "express";

const PORT = 8000;
const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send("Welcome to expense tracker api");
});

app.listen(PORT, () => {
  console.log(`Application run on => http://localhost:${PORT}`);
});
