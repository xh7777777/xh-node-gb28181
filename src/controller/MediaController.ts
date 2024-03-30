import { Context, Next } from "koa";
import { resolve } from "../utils/httpUtil";
import InviteEmitter from "../Sip/emitter/InviteEmitter";
import ByeEmitter from "../Sip/emitter/ByeEmitter";
import WebSocketStream from "websocket-stream";
import ffmpeg from "fluent-ffmpeg";
import logUtil from '../utils/logUtil';
const logger = logUtil("MediaController");

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

    public static async testVideo(ctx:Context, next:Next) {
        ctx.body = resolve.json({
            url: 'ws://localhost:3000/websocket/rtsp/rtmp:%2F%2F127.0.0.1%2Frtp%2F01312D00'
        });
    }

    public static async handleRtspRequest(ctx:Context, next:Next) {
        // 获取播放地址
        const url = ctx.params.url;
        logger.info("handleRtspRequest", url);
        const stream = WebSocketStream(ctx.websocket)
        let t = setInterval(function() {
            let n = Math.random()
            if(n > 0.3) {
              let msg = JSON.stringify({ 'id': ctx.params.url, 'n': n })
              // @ts-ignore
              ctx.websocket.send(msg)
            }
          }, 1000)

        ctx.websocket.on("close", function () {
            console.log("rtsp websocket close");
            stream.destroy();
        })

        ctx.websocket.on("message", function (message) {
            console.log("rtsp websocket message", message);
        });
        try {
            ffmpeg(url)
                // .addInputOption("-rtmp_transport", "tcp", "-buffer_size", "102400") // 这里可以添加一些 RTSP 优化的参数
                .on("start", function () {
                    console.log(url, "Stream started.");
                })
                .on("codecData", function () {
                    console.log(url, "Stream codecData.")// 摄像机在线处理
                })
                .on("error", function (err) {
                    console.log(url, "An error occured: ", err.message);
                })
                .on("end", function () {
                    console.log(url, "Stream end!");// 摄像机断线的处理
                })
                .outputFormat("flv").videoCodec("copy").noAudio().pipe(stream);
        } catch (error) {
            console.log(error);
        }
    }
}