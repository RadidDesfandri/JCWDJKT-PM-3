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

  public initializeRoute() {
    this.router.get("/", this.controller.all);
    this.router.get("/:postId", this.controller.detail);

    this.router.post("/", this.controller.create);
    this.router.post("/:postId/comment", this.controller.createComment);
    this.router.post("/:postId/like", this.controller.like);

    this.router.patch("/:postId/:userId", this.controller.update);

    this.router.delete("/:postId/:userId", this.controller.delete);
  }
}

export default new PostRouter().router;
