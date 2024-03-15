import ByeGenerator from "../generator/ByeGenerator";
import { DeviceController } from "../../controller/DeviceController";
import sip from "sip";
import logUtil from "../../utils/logUtil";
const logger = logUtil("ByeEmitter");
import { HttpException, NotFound } from "../../utils/httpUtil";
import ZLMediaKit from "../../Media/ZLMediaKit";

export default class ByeEmitter {
    public static async sendBye(deviceId:string, channelId:number){
        // todo 发送bye
        const deviceCacheId = `${deviceId}@${channelId}`;
        const device = await DeviceController.getSession(deviceCacheId);
        if (!device) {
            throw new NotFound("设备会话不存在");
        }
        const message = await ByeGenerator.generateDeviceSessionBye(device)
        sip.send(message, async (res) => {
            logger.info("收到bye响应：", res);

            // 删除会话的缓存
            DeviceController.deleteSession(deviceId, channelId);
            // 关闭rtp端口
            const info = await ZLMediaKit.closeRtpServer(deviceId);
            logger.info("关闭rtp端口：", info);
            if (info.code !== 0) throw new HttpException("关闭RTP端口失败或端口已自动关闭", 500);
        });
    }
}