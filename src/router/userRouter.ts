import Router from "koa-router";
import jwtAuth from "koa-jwt";
import UserController from "../controller/UserController";
import { HTTP_CONFIG } from "../config";
import koaAuth from "../middleware/koaAuth";

const userRouter = new Router({
  prefix: "/" + HTTP_CONFIG.prefix + "/user",
});

// @ts-ignore
userRouter.post("/register", UserController.register);

// @ts-ignore
userRouter.post("/login", UserController.login);

// @ts-ignore
userRouter.get(
  "/info",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  UserController.getUserInfo
);

// @ts-ignore
userRouter.post(
  "/delete",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  UserController.deleteUser
);

export default userRouter;
