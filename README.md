#### 基于Node.js的GB28181客户端
### 持续开发中
### 安装
- Node版本 >= 18
- cd .init && docker-compose up
- yarn install
- yarn dev
### web平台基于vite+react
- cd web-app
- yarn install
- yarn dev
### 目前功能
作为服务端  
-  [X] 国标设备接入/注册
-  [X] 心跳/在线状态 MESSAGE
-  [X] 实时视频预览播放
-  [X] 视频设备信息同步/设备信息查询;
  -  [X] 设备目录
  -  [X] 设备信息
  -  [X] 设备状态
-  [X] 无人观看自动断流;
-  [X] 平台用户管理/平台配置查询
- [X] 云台控制（方向、缩放控制）;
### 开发中

-
- 历史音视频检索/视音频文件下载/录像查询与回放（需要NVR\DVR支持）;
- NAT穿透/公网部署
- 订阅与通知
- 国标级联