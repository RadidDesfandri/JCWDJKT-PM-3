import { Router } from "express";
import PostController from "../controllers/post.controller";

class PostRouter {
  public router: Router;
  private controller: PostController;

  constructor() {
    this.router = Router();
    this.controller = new PostController();

    this.initializeRoute();
  }

  public initializeRoute() {}
}

export default new PostRouter().router;
