export const MYSQL_CONFIG = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    charset: "utf8mb4",
    port: process.env.DATABASE_PORT || 13306,
};

export const SIP_CONFIG = {
    port: 15060,
    host: process.env.SIP_HOST || 'localhost',
    id: process.env.SIP_ID || '34020000002000000001',
    realm: process.env.SIP_REALM || '3402000000',
    password: process.env.SIP_PASSWORD || '12345678',
    version: process.env.SIP_VERSION || '2.0',
    protocol: process.env.SIP_PROTOCOL || 'UDP',
    userAgent: process.env.SIP_USER_AGENT || '34020000002000000001',
    maxForwards: process.env.SIP_MAX_FORWARDS || '70',
};

export const HTTP_CONFIG = {
    port: process.env.HTTP_PORT || 3000,
    host: process.env.HTTP_HOST || 'localhost',
    prefix: process.env.HTTP_PREFIX || '/api'
}

export const WEBSOCKET_CONFIG = {
    port: process.env.WS_PORT || 9999,
    host: process.env.WS_HOST || 'localhost',
    prefix: process.env.WS_PREFIX || '/ws'
}

export const ZLMediaKitConfig = {
    host: process.env.ZLMediaKit_HTTP_HOST || 'localhost',
    port: process.env.ZLMediaKit_HTTP_PORT || 8080,
    secret: process.env.ZLMediaKit_SECRET,
    rtp_port_min: process.env.ZLMediaKit_RTP_PORT_MIN || 10000,
    rtp_port_max: process.env.ZLMediaKit_RTP_PORT_MAX || 20000,
    rtmp_port: process.env.ZLMediaKit_RTMP_PORT || 1935,
};