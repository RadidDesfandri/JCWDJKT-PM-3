import { Router } from "express";
import AuthController from "../controllers/auth.controller";

class AuthRouter {
  public router: Router;
  private controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();

    this.initializeRoute();
  }

  public initializeRoute() {
    this.router.post("/register", this.controller.register);
    this.router.post("/login", this.controller.login);
  }
}

export default new AuthRouter().router;
