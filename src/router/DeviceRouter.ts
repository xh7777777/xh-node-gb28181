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
  "/refresh",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  DeviceController.refreshDevice
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

// @ts-ignore
deviceRouter.post(
  "/deleteChannelVideo",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  DeviceController.closeStream
);

// @ts-ignore
deviceRouter.post(
  "/deviceControl",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  DeviceController.ptzControl
);

// @ts-ignore
deviceRouter.post(
  "/deviceChannelStreamMode",
  jwtAuth({
    secret: process.env.JWT_SECRET || "secret",
  }),
  koaAuth,
  DeviceController.changeStreamMode
);




export default deviceRouter;
