export enum DeviceInfoCmdTypeEnum {
    Catalog = "Catalog", // 设备目录
    DeviceInfo = "DeviceInfo", // 设备信息
    DeviceStatus = "DeviceStatus", // 设备状态
    Keepalive = "Keepalive", // 心跳
}

export enum sipMethodEnum {
    register = "REGISTER",
    invite = "INVITE",
    message = "MESSAGE",
    ack = "ACK",
    bye = "BYE",
    cancel = "CANCEL",
}

export enum sipContentTypeEnum {
    xml = "application/MANSCDP+xml",
    sdp = "application/sdp",
    plain = "text/plain",
    json = "application/json",
}