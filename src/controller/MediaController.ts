import { Context, Next } from "koa";
import { resolve } from "../utils/httpUtil";
import InviteEmitter from "../Sip/emitter/InviteEmitter";
import ByeEmitter from "../Sip/emitter/ByeEmitter";
import WebSocketStream from "websocket-stream";
import ffmpeg from "fluent-ffmpeg";
import logUtil from '../utils/logUtil';
const logger = logUtil("MediaController");
import cacheUtil from "../utils/cacheUtil";
import { DeviceController } from "./DeviceController";
import ZLMediaKit from "../Media/ZLMediaKit";
import fs from "fs";
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

    // 检测当前通道的推流状态
    public static async checkStream(ctx:Context, next:Next) {

    }

    public static async getSnap(ctx:Context, next:Next) {
        const { url, timeout_sec = 10, expire_sec = 30, deviceId, channelId } = ctx.request.body;
        console.log("getSnap", url, timeout_sec, expire_sec);
        const snap = await ZLMediaKit.getSnap({url, timeout_sec, expire_sec});
        snap.pipe(fs.createWriteStream(`./snap/${deviceId}_${channelId}.jpg`));
        logger.info("getSnap", snap);
        ctx.body = resolve.json(111);
    }

    public static async startRecord(ctx:Context, next:Next) {
        const { app, stream} = ctx.request.body;
        const res = await ZLMediaKit.startRecord({type: 1, vhost: "localhost", app, stream});
        ctx.body = resolve.json(res);
    }

    public static async stopRecord(ctx:Context, next:Next) {
        const { app, stream} = ctx.request.body;
        const res = await ZLMediaKit.stopRecord({type: 1, vhost: "localhost", app, stream});
        ctx.body = resolve.json(res);
    }

    public static isRecording(ctx:Context, next:Next) {
        const { app, stream} = ctx.request.body;
        const res = ZLMediaKit.isRecording({type: 1, vhost: "localhost", app, stream});
        ctx.body = resolve.json(res);
    }

    public static async getMp4RecordFile(ctx:Context, next:Next) {
        const { app, stream, period} = ctx.request.body;
        const res = await ZLMediaKit.getMp4RecordFile({vhost: "localhost", app, stream, period});
        ctx.body = resolve.json(res);
    }

    public static async handleRtspRequest(ctx:Context, next:Next) {
        // 获取播放地址
        const url = ctx.params.url;
        logger.info("handleRtspRequest", url);
        const streamId = url.split("/").pop();
        const stream = WebSocketStream(ctx.websocket)

        ctx.websocket.on("close", async function () {
            console.log("rtsp websocket close");
            const timer = cacheUtil.get(streamId.replace('_', '@'));
            if (!timer) {
                await DeviceController.closeStreamFunc(streamId.split('_')[0], streamId.split('_')[1], 600000);
            }
            stream.destroy();
        });

        ctx.websocket.on("connection", function () {
            console.log("rtsp websocket connect");
        })

        ctx.websocket.on("message", function (message) {
            // 心跳检测
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

    public static async playRecord(ctx:Context, next:Next) {
        const { app, stream, date, fileName } = ctx.query;
        logger.info("playRecord", app, stream, date, fileName);
        // const { app, stream, date, fileName } = ctx.request.body;
        // @ts-ignore
        const path = ZLMediaKit.getMp4Record({app, stream, date, fileName});
        logger.info("playRecord", path);
        // 向path发送post请求， 结果是一个mp4文件
        ctx.redirect(path);
    }
}