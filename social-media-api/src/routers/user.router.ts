import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class UserRouter {
  public router: Router;
  private controller: UserController;
  private middleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.middleware = new AuthMiddleware();

    this.initializeRoute();
  }

  public initializeRoute() {
    this.router.get("/", this.controller.all);
    this.router.get(
      "/detail",
      this.middleware.verifyUserToken,
      this.controller.detail
    );
    this.router.get("/posts", this.controller.getUserPost);

    this.router.patch("/update", this.controller.update);
  }
}

export default new UserRouter().router;
