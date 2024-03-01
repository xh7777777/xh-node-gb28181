import Router from "koa-router";
import userRouter from "./userRouter";
import deviceRouter from "./DeviceRouter";
import mediaRouter from "./MediaRouter";
import platformConfigRouter from "./PlatformConfigRouter";

const router = new Router();

router.use(userRouter.routes());
userRouter.allowedMethods();

router.use(deviceRouter.routes());
deviceRouter.allowedMethods()

router.use(platformConfigRouter.routes());
platformConfigRouter.allowedMethods();

router.use(mediaRouter.routes());
mediaRouter.allowedMethods();

export default router;