import { Router } from "express";
import UserController from "../controllers/user.controller";

class UserRouter {
  public router: Router;
  private controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();

    this.initializeRoute();
  }

  public initializeRoute() {
    this.router.get("/", this.controller.all);
    this.router.get("/:userId", this.controller.detail);
    this.router.get("/:userId/posts", this.controller.getUserPost);

    this.router.patch("/:userId", this.controller.update);
  }
}

export default new UserRouter().router;
