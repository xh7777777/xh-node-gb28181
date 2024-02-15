import sip from 'sip';
import { SipServerConfig, SipRequest, SipRemote } from '../types/sip.type';
import { SIP_CONFIG } from '../config';
import logUtil from '../utils/logUtil';

const logger = logUtil('SipServer');

export default class SipServer {
    private running: boolean = false;
    private sipConfig: SipServerConfig = SIP_CONFIG;
    private onRequest: (req:SipRequest, remote?:any) => void;

    /*
    * @param sipConfig 配置 port：sip端口, host：本机ip地址, udp, tcp, logger
    * @param callback 接收到请求的回调 req:请求 remote:请求来源
    */
    constructor(sipConfig:SipServerConfig, callback:(req:SipRequest, remote:SipRemote) => void) {
        this.sipConfig = sipConfig;
        this.onRequest = callback;
        this.start();
    }

    private start() {
        if (this.running) {
            return;
        }
        sip.start(this.sipConfig, this.onRequest);
        this.running = true;
        logger.info('SipServer started at: ' + this.sipConfig.host + ':' + this.sipConfig.port);
    }

    public restart() {
        this.stop();
        this.start();
    }

    public stop() {
        if (!this.running) {
            return;
        }
        sip.stop();
        this.running = false;
    }
}