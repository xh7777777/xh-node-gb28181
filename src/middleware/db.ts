import { Sequelize } from "sequelize";
import { MYSQL_CONFIG } from "../config";
import mysql from "mysql2";
import logUtil from "../utils/logUtil";
const logger = logUtil("DB");

export const sequelize = new Sequelize(
  'mysql',
  MYSQL_CONFIG.user || "root",
  MYSQL_CONFIG.password,
  {
    host: MYSQL_CONFIG.host || "localhost",
    dialect: "mysql",
  }
);

export async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
}

// 原始查询， orm不能满足需求时再使用
// const pool = mysql.createPool(MYSQL_CONFIG);
// const query = (sql: string) => {
//   return new Promise((resolve, reject) => {
//     pool.getConnection(function (err:any, connection:any) {
//       if (err) reject(err);
//       else {
//         connection.query(sql, function (err:any, res:any) {
//           if (err) reject(err);
//           else resolve(res);
//         });
//         connection.release();
//       }
//     });
//   });
// };
