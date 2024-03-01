import ByeGenerator from "../generator/ByeGenerator";
import { DeviceController } from "../../controller/DeviceController";
import sip from "sip";
import logUtil from "../../utils/logUtil";
const logger = logUtil("ByeEmitter");

export default class ByeEmitter {
    public static async sendBye(deviceId:string, channelId:string): Promise<boolean>{
        // todo 发送bye
        const deviceCacheId = `${deviceId}@${channelId}`;
        const device = await DeviceController.getSession(deviceCacheId);
        if (!device) {
            return false;
        }
        const message = await ByeGenerator.generateDeviceSessionBye(device)
        sip.send(message, (res) => {
            logger.info("收到bye响应：", res);
        });
        return true;
    }
}