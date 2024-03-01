import { Context, Next } from "koa";
import { resolve } from "../utils/httpUtil";
import ByeEmitter from "../Sip/emitter/ByeEmitter";

export default class MediaController {
    public static async closeStream(ctx:Context, next:Next) {
        const { deviceId, channelId } = ctx.request.body;
        ByeEmitter.sendBye(deviceId, channelId);
        // todo 发送bye
        ctx.body = resolve.json({
            deviceId,
            channelId
        },'成功');
    }
}