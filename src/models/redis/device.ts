export default interface IRedisDevice {
    key: string; // 设备ID
    value: {
        ip: string; // 设备IP
        port: number; // 设备端口
        online: boolean; // 设备是否在线
    }
}