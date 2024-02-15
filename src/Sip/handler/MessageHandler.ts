import sip from "sip";
import { SipRequest } from "../../types/sip.type";
import { parseString } from 'xml2js'

interface XmlContent {
    Notify: {
        CmdType: string[];
        SN: string[];
        DeviceID: string[];
        Status: string[];
        Info: string[];
    }
}


export default class MessageHandler {
    public static handleMessage(req: SipRequest) {
        // 检测设备是否在线， 否则要求重新注册
        // db check

        // 解析xml
        parseString(req.content, (err, result:XmlContent) => {
            const { CmdType } = result.Notify;
            if (CmdType[0] === 'Keepalive') {
                this.keepAlive(req);
            }
        })
    }
    private static keepAlive(req: SipRequest) {
        const resp = sip.makeResponse(req, 200, "Ok");
        sip.send(resp);
    }
}