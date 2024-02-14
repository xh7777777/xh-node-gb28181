import sip from 'sip';
import { SipServerConfig, SipRequest } from '../type/sip.type';
import log4js from 'log4js';
const logger = log4js.getLogger('SipServer');

export default class SipServer {
    private running: boolean = false;
    private sipConfig: SipServerConfig | null = null;
    private onRequest: (req:SipRequest, remote?:any) => void;
    constructor(sipConfig:SipServerConfig, callback:(req:SipRequest, remote?:any) => void) {
        this.sipConfig = sipConfig;
        this.onRequest = callback;
        this.start();
    }

    private start() {
        sip.start(this.sipConfig, this.onRequest);
        this.running = true;
    }
}