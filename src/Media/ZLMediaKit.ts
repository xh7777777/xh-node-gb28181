import { ZLMediaKitConfig } from "../config";

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
}