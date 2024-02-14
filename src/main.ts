import SipServer from "./SipServer";

//启动sip服务器，实例创建后自动启动
const sipServer = new SipServer({port: 15060, host: process.env.SIP_HOST || 'localhost'}, (req, remote) => {
    console.log('SipServer received request: ', req);
    console.log('SipServer received from: ', remote);
});
