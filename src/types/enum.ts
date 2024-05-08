export enum DeviceInfoCmdTypeEnum {
    Catalog = "Catalog", // 设备目录
    DeviceInfo = "DeviceInfo", // 设备信息
    DeviceStatus = "DeviceStatus", // 设备状态
    Keepalive = "Keepalive", // 心跳
    DeviceControl = "DeviceControl", // 设备控制
    RecordInfo = "RecordInfo", // 查询录像信息
    Alarm = "Alarm", // 报警
    ConfigDownload = "ConfigDownload", // 配置下载
    PresetQuery = "PresetQuery", // 查询预置位
    MobilePosition = "MobilePosition", // 移动定位
    Broadcast = "Broadcast", // 广播
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

export enum mediaProtocolEnum { 
    rtsp = "rtsp",
    rtmp = "rtmp",
    hls = "hls",
    flv = "flv",
}

export enum deviceControlActionEnum {
    left = "left",
    leftup = "leftup",
    leftdown = "leftdown",
    right = "right",
    rightup = "rightup",
    rightdown = "rightdown",
    up = "up",
    down = "down",
    zoomIn = "zoomIn", // 镜头
    zoomOut = "zoomOut",
    focusIn = "focusIn",// 光圈
    focusOut = "focusOut",
    irisIn = "irisIn",//聚焦
    irisOut = "irisOut",
    stop = "stop",
}

export enum ptzCmdEnum {
    left= "A50F010290000047",
    stop= "A50F0100000000B5",
    right= "A50F010190000046",
    up= "A50F010800FA00B7",
    down="A50F010400FA00B3",
    leftup= "A50F010AFAFA00B3",
    leftdown="A50F0106FAFA00AF",
    rightup="A50F0109FAFA00B2",
    rightdown="A50F0105FAFA00AE",
    zoomOut="A50F01100000A065",
    zoomIn="A50F01200000A075",
    focusOut="A50F014400FA00F3",
    focusIn="A50F014800FA00F7",
    irisOut="A50F0141FA0000F0",
    irisIn = "A50F0142FA0000F1",
}

export enum zlmStreamMode {
    udp = "0",
    tcpPassive = "1",
    tcpActive = "2",
}