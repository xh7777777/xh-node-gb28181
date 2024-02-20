import {Next, Context} from 'koa';
import {resolve} from '../utils/httpUtil';
import { SIP_CONFIG } from '../config';

export default class PlatformConfigController {
    public static async getPlatformConfig(ctx: Context, next: Next) {
        resolve.json(SIP_CONFIG);
    }
}