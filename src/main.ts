//dotenv要在其他模块之前加载，因为其他模块可能会用到环境变量
require("dotenv").config();

import SipServer from "./SipServer";
import { SIP_CONFIG } from "./config";
import { testConnection } from "./middleware/db";


//启动sip服务器，实例创建后自动启动
const sipServer = new SipServer(SIP_CONFIG, (req, remote) => {
  console.log("SipServer received request: ", req);
  console.log("SipServer received from: ", remote);
});

//测试数据库连接
testConnection();