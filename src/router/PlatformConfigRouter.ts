import Router from "koa-router";
import jwtAuth from "koa-jwt";
import PlatformConfigController from "../controller/PlatformConfigController";
import { HTTP_CONFIG } from "../config";
import koaAuth from "../middleware/koaAuth";

const platformConfigRouter = new Router({
  prefix: "/" + HTTP_CONFIG.prefix + "/config",
});

// @ts-ignore
platformConfigRouter.get(
  "/list",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  PlatformConfigController.getPlatformConfig
);

export default platformConfigRouter;
