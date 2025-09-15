import { Router } from "express";
import PostController from "../controllers/post.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class PostRouter {
  public router: Router;
  private controller: PostController;
  private middleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.controller = new PostController();
    this.middleware = new AuthMiddleware();

    this.initializeRoute();
  }

  public initializeRoute() {
    this.router.get("/", this.controller.all);
    this.router.get("/:postId", this.controller.detail);

    this.router.post(
      "/",
      this.middleware.verifyUserToken,
      this.controller.create
    );
    this.router.post(
      "/:postId/comment",
      this.middleware.verifyUserToken,
      this.controller.createComment
    );
    this.router.post(
      "/:postId/like",
      this.middleware.verifyUserToken,
      this.controller.like
    );

    this.router.patch(
      "/:postId",
      this.middleware.verifyUserToken,
      this.controller.update
    );

    this.router.delete(
      "/:postId",
      this.middleware.verifyUserToken,
      this.controller.delete
    );
  }
}

export default new PostRouter().router;
