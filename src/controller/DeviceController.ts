import Device from "../models/deviceModel";
import { sequelize } from "../utils/dbUtil";
import { Context, Next } from "koa";
import { resolve } from '../utils/httpUtil';
import { SipRequest } from "../types/sip.type";
import { getDeviceInfoFromSip } from "../utils/SipUtil";

class DeviceController {
  public static async getDevices(ctx: Context, next?: Next) {
    const allDevice = await Device.findAll();
    ctx.body = resolve.json(allDevice);
  }

  public async addDevice(req: SipRequest) {
    const device = getDeviceInfoFromSip(req);
    return await Device.create(device);
  }

  public async deleteDevice(device_id: string) {
    return await Device.destroy({
      where: {
        device_id: device_id,
      },
    });
  }
}