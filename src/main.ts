//dotenv要在其他模块之前加载，因为其他模块可能会用到环境变量
require("dotenv").config();

import SipServer from "./Sip";
import { SIP_CONFIG, HTTP_CONFIG } from "./config";
import { testConnection, syncModel } from "./utils/dbUtil";
import RegisterHandler from "./Sip/handler/RegisterHandler";
import MessageHandler from "./Sip/handler/MessageHandler";
import InviteHandler from "./Sip/handler/InviteHandler";
import client from "./middleware/redis";
import logUtil from "./utils/logUtil";
import app from "./httpServer";
import sip from "sip";

const logger = logUtil("main");

//测试redis连接
client.connect().then(() => {
  logger.info("Redis connected");
});

const sipConfig = {
  host: SIP_CONFIG.host,
  port: SIP_CONFIG.port,
  udp: SIP_CONFIG.protocol === "UDP" || SIP_CONFIG.protocol === "udp",
  tcp: SIP_CONFIG.protocol === "TCP" || SIP_CONFIG.protocol === "tcp",
};
//启动sip服务器，实例创建后自动启动
new SipServer(sipConfig, async (req, remote) => {
  logger.info("SipServer received request: ", req);
  logger.info("SipServer received remote: ", req.headers.from.params, req.headers.to.params)

  const { method } = req;
  if (method === "REGISTER") {
    await RegisterHandler.handleRegister(req);
  } else if (method === "MESSAGE") {
    await MessageHandler.handleMessage(req);
  } else if (method === "BYE") {
    sip.send(sip.makeResponse(req, 200, "Ok"));
  } else if (method === "INVITE") {
    await InviteHandler.responseInviteAck(req);
  }
});

//测试数据库连接
testConnection();
//同步数据库模型
// syncModel();

//启动http服务器
app.listen(HTTP_CONFIG.port, () => {
  logger.info(`Http Server started at ${HTTP_CONFIG.host}:${HTTP_CONFIG.port}`);
});
