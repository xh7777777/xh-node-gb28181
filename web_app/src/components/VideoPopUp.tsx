import React from "react";
import Modal from "antd/es/modal/Modal";
import MsePlayer from "./MsePlayer";
import { Menu, Slider, Col, Button } from "antd";
import { MenuProps } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
  DownOutlined,
  PauseOutlined,
  PlusOutlined,
  MinusOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  deviceControl,
  getSnap,
  startRecord,
  stopRecord,
  isRecording,
} from "../apis";
import dayjs from "dayjs";

const appName = "rtp";

const items: MenuProps["items"] = [
  {
    label: "媒体操作",
    key: "video",
    icon: <VideoCameraOutlined />,
  },
  {
    label: "云台控制",
    key: "control",
    icon: <AppstoreOutlined />,
  },
  {
    label: "编码信息",
    key: "code",
    icon: <MailOutlined />,
  },
];
enum deviceControlActionEnum {
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
  focusIn = "focusIn", // 光圈
  focusOut = "focusOut",
  irisIn = "irisIn", //聚焦
  irisOut = "irisOut",
  stop = "stop",
}

const handleDeviceControl = async (
  deviceId: string,
  channelId: string,
  control: string
) => {
  try {
    const res = await deviceControl(deviceId, channelId, control);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

function VideoPopUp({
  socketUrl,
  show,
  handleCloseVideo,
  deviceId,
  channelId,
  messageApi,
}: {
  socketUrl: string;
  show: boolean;
  handleCloseVideo: () => void;
  deviceId: string;
  channelId: string;
  messageApi: any;
}) {
  const [current, setCurrent] = React.useState("control");
  const [slideValue, setSlideValue] = React.useState(0);
  const videoUrl = React.useMemo(() => {
    let arr = socketUrl.split("/");
    return arr[arr.length - 1].replace(/%2F/g, "/");
  }, [socketUrl]) as any;

  const onSlideValueChange = (value: number) => {
    setSlideValue(value);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };
  console.log(socketUrl);

  return (
    // 遮罩层
    <Modal
      title="视频预览"
      open={show}
      onOk={() => {}}
      onCancel={handleCloseVideo}
      footer={null}
      width={1400}
      maskClosable={false}
    >
      <div className="h-[400px] md:h-[850px] overflow-auto flex flex-col gap-4">
        <div className=" flex-1">
          {socketUrl && <MsePlayer socketUrl={socketUrl} />}
        </div>
        <div className=" w-full h-1 bg-slate-300"></div>
        <div>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            className="w-full h-full"
          />
        </div>
        <div className=" h-40">
          {current === "video" && (
            <MediaAction
              deviceId={deviceId}
              channelId={channelId}
              url={videoUrl}
              messageApi={messageApi}
            />
          )}
          {current === "control" && (
            <Controller
              slideValue={slideValue}
              onChange={onSlideValueChange}
              deviceId={deviceId}
              channelId={channelId}
            />
          )}
          {current === "code" && (
            <Code
              socketUrl={videoUrl}
              currentPlayer="flv.js"
              codeInfo="h.264"
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default VideoPopUp;

function MediaAction({
  deviceId,
  channelId,
  url,
  messageApi,
}: {
  deviceId: string;
  channelId: string;
  url: string;
  messageApi: any;
}) {
  const [checkRecordInterval, setCheckRecordInterval] =
    React.useState<any>(null);
  const [isRecordingStatus, setIsRecordingStatus] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [recordStartTime, setRecordStartTime] = React.useState('');

  console.log(url, 11111);
  async function handleSnap() {
    try {
      const res = await getSnap(url);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleStartRecord() {
    try {
      if (isRecordingStatus) {
        messageApi.info("正在录制中");
        return;
      }
      const res = await startRecord(appName, `${deviceId}_${channelId}`);
      messageApi.success(res?.data?.data?.msg);
      let timer = setInterval(async () => {
        const checkRes = await isRecording(appName, `${deviceId}_${channelId}`);
        if (checkRes?.data?.code !== 200) {
          messageApi.error("录像因服务异常停止");
          clearInterval(timer);
          setCheckRecordInterval(null);
          setRecordingTime(0);
          setIsRecordingStatus(false);
          return;
        }
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      // 记录录像时常
      setRecordStartTime(dayjs().format('YYYYMMDD-HH:mm:ss'));
      setCheckRecordInterval(timer);
      setIsRecordingStatus(true);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleStopRecord() {
    try {
      clearInterval(checkRecordInterval);
      setCheckRecordInterval(null);
      const res = await stopRecord(appName, `${deviceId}_${channelId}`);
      messageApi.success(res?.data?.data?.msg);
      setRecordingTime(0);
      setIsRecordingStatus(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col gap-6 h-20">
      <div className="flex gap-4 w-1/2">
        <Button onClick={handleStartRecord}>开始录制</Button>
        <Button onClick={handleStopRecord}>停止录制</Button>
        <Button onClick={handleSnap}>抓图</Button>
      </div>
      <div>
        {isRecordingStatus && (
          <div>
            <div>录制中-当前时长: {recordingTime}秒</div>
            <div>开始时间: {recordStartTime}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Controller({
  slideValue,
  onChange,
  deviceId,
  channelId,
}: {
  slideValue: number;
  onChange: (value: number) => void;
  deviceId: string;
  channelId: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="ml-4 flex">
          <div className=" flex flex-col w-10 justify-center items-center ml-12">
            <div className="flex">
              <Button
                onClick={() =>
                  handleDeviceControl(
                    deviceId,
                    channelId,
                    deviceControlActionEnum.leftup
                  )
                }
              >
                <UpOutlined className=" -rotate-45" />
              </Button>
              <Button
                onClick={() =>
                  handleDeviceControl(
                    deviceId,
                    channelId,
                    deviceControlActionEnum.up
                  )
                }
              >
                <UpOutlined />
              </Button>
              <Button
                onClick={() =>
                  handleDeviceControl(
                    deviceId,
                    channelId,
                    deviceControlActionEnum.rightup
                  )
                }
              >
                <UpOutlined className=" rotate-45" />
              </Button>
            </div>
            <div className="flex">
              <Button
                onClick={() =>
                  handleDeviceControl(
                    deviceId,
                    channelId,
                    deviceControlActionEnum.left
                  )
                }
              >
                <LeftOutlined />
              </Button>
              <Button
                onClick={() =>
                  handleDeviceControl(
                    deviceId,
                    channelId,
                    deviceControlActionEnum.stop
                  )
                }
              >
                <PauseOutlined />
              </Button>
              <Button
                onClick={() =>
                  handleDeviceControl(
                    deviceId,
                    channelId,
                    deviceControlActionEnum.right
                  )
                }
              >
                <RightOutlined />
              </Button>
            </div>
            <div className="flex">
              <Button
                onClick={() =>
                  handleDeviceControl(
                    deviceId,
                    channelId,
                    deviceControlActionEnum.leftdown
                  )
                }
              >
                <DownOutlined className=" rotate-45" />
              </Button>
              <Button
                onClick={() =>
                  handleDeviceControl(
                    deviceId,
                    channelId,
                    deviceControlActionEnum.down
                  )
                }
              >
                <DownOutlined />
              </Button>
              <Button
                onClick={() =>
                  handleDeviceControl(
                    deviceId,
                    channelId,
                    deviceControlActionEnum.rightdown
                  )
                }
              >
                <DownOutlined className=" -rotate-45" />
              </Button>
            </div>
          </div>
          <div className=" ml-24 flex flex-col justify-between">
            <Button
              onClick={() =>
                handleDeviceControl(
                  deviceId,
                  channelId,
                  deviceControlActionEnum.zoomOut
                )
              }
            >
              <PlusOutlined />
            </Button>
            <Button
              onClick={() =>
                handleDeviceControl(
                  deviceId,
                  channelId,
                  deviceControlActionEnum.zoomIn
                )
              }
            >
              <MinusOutlined />
            </Button>
          </div>
        </div>
        <Col span={4} className=" ml-4">
          <Slider value={slideValue} onChange={onChange} />
        </Col>
      </div>
    </div>
  );
}

function Code({
  socketUrl,
  currentPlayer,
  codeInfo,
}: {
  socketUrl: string;
  currentPlayer: string;
  codeInfo: string;
}) {
  return (
    <div>
      <div className=" bg-slate-200 p-2 rounded-md">
        播放地址: <span className=" font-bold ml-4">{socketUrl}</span>
      </div>
      <div className=" bg-slate-200 p-2 rounded-md">
        播放器: <span className=" font-bold ml-4">{currentPlayer}</span>
      </div>
      <div className=" bg-slate-200 p-2 rounded-md">
        编码信息: <span className=" font-bold ml-4">{codeInfo}</span>
      </div>
    </div>
  );
}
