//dotenv要在其他模块之前加载，因为其他模块可能会用到环境变量
require("dotenv").config();

import SipServer from "./Sip";
import { SIP_CONFIG } from "./config";
import { testConnection, syncModel } from "./utils/dbUtil";
import RegisterHandler from "./Sip/handler/RegisterHandler";
import MessageHandler from "./Sip/handler/MessageHandler";


//启动sip服务器，实例创建后自动启动
new SipServer(SIP_CONFIG, (req, remote) => {
  console.log("SipServer received request: ", req);
  const { method } = req;
    if (method === "REGISTER") {
        RegisterHandler.handleRegister(req);
    } else if (method === "MESSAGE") {
        MessageHandler.handleMessage(req);
    }
});

//测试数据库连接
testConnection();
//同步数据库模型
// syncModel();