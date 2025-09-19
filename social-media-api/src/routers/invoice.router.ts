import { Router } from "express";
import InvoiceController from "../controllers/invoice.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class InvoiceRouter {
  public router: Router;
  private controller: InvoiceController;
  private middleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.controller = new InvoiceController();
    this.middleware = new AuthMiddleware();

    this.initializeRoute();
  }

  public initializeRoute() {
    this.router.post(
      "/create",
      this.middleware.verifyUserToken,
      this.controller.create
    );

    this.router.post("/webhook", this.controller.webhook);
  }
}

export default new InvoiceRouter().router;
