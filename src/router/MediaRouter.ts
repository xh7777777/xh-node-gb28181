import Router from "koa-router";
import jwtAuth from "koa-jwt";
import { DeviceController } from "../controller/DeviceController";
import MediaController from "../controller/MediaController";
import { HTTP_CONFIG } from "../config";
import koaAuth from "../middleware/koaAuth";

const mediaRouter = new Router({
  prefix: "/" + HTTP_CONFIG.prefix + "/media",
});

// @ts-ignore
// deviceRouter.get(
//   "/list",
//   jwtAuth({
//     secret: process.env.JWT_SECRET || "secret",
//   }),
//   koaAuth,
//   DeviceController.getDeviceList
// );

// @ts-ignore
mediaRouter.post("/closeInvite", MediaController.closeStream);

// @ts-ignore
mediaRouter.get("/testVideo", MediaController.testVideo);

// @ts-ignore
// userRouter.get(
//   "/info",
//   jwtAuth({
//     secret: process.env.JWT_SECRET || "secret",
//   }),
//   koaAuth,
//   UserController.getUserInfo
// );

export default mediaRouter;
