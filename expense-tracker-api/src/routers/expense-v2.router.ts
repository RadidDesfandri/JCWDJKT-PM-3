import { Router } from "express";
import ExepenseControllerV2 from "../controllers/expense-v2.controller";

class ExpenseRouteV2 {
  public router: Router;
  private controller: ExepenseControllerV2;

  constructor() {
    this.router = Router();
    this.controller = new ExepenseControllerV2();

    this.initializeRoute();
  }

  public initializeRoute() {
    this.router.get("/", this.controller.all);
    this.router.get("/total-by-date", this.controller.getTotalByDateRange);
    this.router.get("/total-by-category", this.controller.getTotalByCategory);
    this.router.get("/:id", this.controller.detail);

    this.router.post("/", this.controller.create);

    this.router.patch("/:id", this.controller.update);

    this.router.delete("/:id", this.controller.delete);
  }
}

export default new ExpenseRouteV2().router;
