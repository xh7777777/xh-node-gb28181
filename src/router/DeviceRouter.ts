import Router from "koa-router";
import jwtAuth from "koa-jwt";
import { DeviceController } from "../controller/DeviceController";
import { HTTP_CONFIG } from "../config";
import koaAuth from "../middleware/koaAuth";

const deviceRouter = new Router({
  prefix: "/" + HTTP_CONFIG.prefix + "/device",
});

// @ts-ignore
deviceRouter.get(
  "/list",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  DeviceController.getDeviceList
);

// @ts-ignore
deviceRouter.post("/invite", DeviceController.inviteStream);

// @ts-ignore
deviceRouter.post(
  "/delete",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  DeviceController.userDeleteDevice
);

// @ts-ignore
deviceRouter.post(
  "/channel",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  DeviceController.getChannelList
);


export default deviceRouter;
