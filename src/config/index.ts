export const MYSQL_CONFIG = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    charset: "utf8mb4",
    port: process.env.DATABASE_PORT || 3306,
};

export const SIP_CONFIG = {
    port: 15060,
    host: process.env.SIP_HOST || 'localhost'
};
