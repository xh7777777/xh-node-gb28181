import { Sequelize } from "sequelize";
import { MYSQL_CONFIG } from "../config";
// 初始化sequelize, 自动连接数据库

const sequelize = new Sequelize(
    'mysql',
    MYSQL_CONFIG.user || "root",
    MYSQL_CONFIG.password,
    {
      host: MYSQL_CONFIG.host || "localhost",
      port: +MYSQL_CONFIG.port || 3306,
      dialect: "mysql",
    }
);

export default sequelize;