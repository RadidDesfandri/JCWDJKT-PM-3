import { Router } from "express";
import {
  create,
  deleteExpense,
  getAll,
  getDetail,
  getTotalByCategory,
  getTotalByDateRange,
  update,
} from "../controllers/expense-v1.controller";

class ExpenseV1Route {
  public router: Router;

  constructor() {
    this.router = Router();

    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get("/expenses", getAll);
    this.router.get("/expenses/report/date-range", getTotalByDateRange);
    this.router.get("/expenses/report/category", getTotalByCategory);
    this.router.get("/expenses/:id", getDetail);

    this.router.post("/expenses", create);

    this.router.patch("/expenses/:id", update);

    this.router.delete("/expenses/:id", deleteExpense);
  }
}

export default new ExpenseV1Route().router;
