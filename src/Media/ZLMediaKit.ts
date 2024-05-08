import { ZLMediaKitConfig } from "../config";
import fs from "fs";

export default class ZLMediaKit {
    static httpUrl: string = `http://${ZLMediaKitConfig.host}:${ZLMediaKitConfig.port}`;
    static secret: string = ZLMediaKitConfig.secret || '';

    /*
    * 开启rtp服务器
    * @param {number} port
    * @param {number} tcp_mode  0 udp 1 tcp 2 tcp主动
    * @param {string} stream_id
    */
    public static async openRtpServer({ port, tcp_mode, stream_id} : {
        port: number,
        tcp_mode?: number,
        stream_id: string
    }) {
        let url = `${this.httpUrl}/index/api/openRtpServer?secret=${this.secret}&port=${port}&&stream_id=${stream_id}`;
        if (tcp_mode) {
            url += `&tcp_mode=${tcp_mode}`;
        }
        const res = await fetch(url)
        return res.json();
    }

    public static async closeRtpServer(stream_id: string) {
        const res = await fetch(`${this.httpUrl}/index/api/closeRtpServer?secret=${this.secret}&stream_id=${stream_id}`);
        return res.json();
    } 

    public static async getServerConfig() {
        const res = await fetch(`${this.httpUrl}/index/api/getServerConfig?secret=${this.secret}`);
        return res.json();
    }

    public static async listRtpServer() {
        const res = await fetch(`${this.httpUrl}/index/api/listRtpServer?secret=${this.secret}`);
        return res.json();
    }

    public static async getSnap({url, timeout_sec, expire_sec}: { url: string, timeout_sec?: number, expire_sec?: number}) {
        const res = await fetch(`${this.httpUrl}/index/api/getSnap?secret=${this.secret}&url=${url}&timeout_sec=${timeout_sec}&expire_sec=${expire_sec}`);
        return res.json()
    }

    public static async startRecord({type, vhost, app, stream, customized_path, max_second}: { type: 0 | 1, vhost: string, app: string, stream: string, customized_path?: string, max_second?: number}) {
        let url = `${this.httpUrl}/index/api/startRecord?secret=${this.secret}&type=${type}&vhost=${vhost}&app=${app}&stream=${stream}`;
        if (customized_path) {
            url += `&customized_path=${customized_path}`;
        }
        if (max_second) {
            url += `&max_second=${max_second}`;
        }

        const res = await fetch(url);
        return res.json();
    }

    public static async stopRecord({type, vhost, app, stream}: {type: 0 | 1,  vhost: string, app: string, stream: string}) {
        const res = await fetch(`${this.httpUrl}/index/api/stopRecord?secret=${this.secret}&type=${type}&vhost=${vhost}&app=${app}&stream=${stream}`);
        return res.json();
    }

    public static async isRecording({type, vhost, app, stream}: {type: 0 | 1,  vhost: string, app: string, stream: string}) {
        const res = await fetch(`${this.httpUrl}/index/api/isRecording?secret=${this.secret}&type=${type}&vhost=${vhost}&app=${app}&stream=${stream}`);
        return res.json();
    }

    public static async getMp4RecordFile({vhost, app, stream, period, customized_path}: { vhost: string, app: string, stream: string, period: number, customized_path?: string}) {
        let url = `${this.httpUrl}/index/api/getMp4RecordFile?secret=${this.secret}&vhost=${vhost}&app=${app}&stream=${stream}&period=${period}`;
        if (customized_path) {
            url += `&customized_path=${customized_path}`;
        }
        const res = await fetch(url);
        return res.json();
    }

    // 返回请求地址
    public static getMp4Record({app, stream, date, fileName}: {app: string, stream: string, date: string, fileName: string}) {
        return `${this.httpUrl}/record/${app}/${stream}/${date}/${fileName}`
    }
}