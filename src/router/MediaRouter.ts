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
mediaRouter.post("/closeInvite", DeviceController.closeStream);

// @ts-ignore
mediaRouter.get("/testVideo", MediaController.testVideo);

// @ts-ignore
mediaRouter.post("/playVideo", MediaController.handleRtspRequest);

// @ts-ignore
mediaRouter.post("/getSnap", MediaController.getSnap);

// @ts-ignore
mediaRouter.post("/startRecord", MediaController.startRecord);

// @ts-ignore
mediaRouter.post("/stopRecord", MediaController.stopRecord);

// @ts-ignore
mediaRouter.post("/isRecording", MediaController.isRecording);

// @ts-ignore
mediaRouter.post("/getMp4RecordFile", MediaController.getMp4RecordFile);

// @ts-ignore
mediaRouter.get("/getMp4Record", MediaController.playRecord);

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
