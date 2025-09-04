import express, { Response, Request, Application } from "express";
import {
  create,
  deleteExpense,
  getAll,
  getDetail,
  getTotalByCategory,
  getTotalByDateRange,
  update,
} from "./controllers/expense.controller";

const PORT = 8000;
const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send("Welcome to expense tracker api");
});

app.get("/api/expenses", getAll);
app.get("/api/expenses/report/date-range", getTotalByDateRange);
app.get("/api/expenses/report/category", getTotalByCategory);
app.get("/api/expenses/:id", getDetail);

app.post("/api/expenses", create);

app.patch("/api/expenses/:id", update);

app.delete("/api/expenses/:id", deleteExpense);

app.listen(PORT, () => {
  console.log(`Application run on => http://localhost:${PORT}`);
});
