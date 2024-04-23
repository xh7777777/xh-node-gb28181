import React, { useState } from "react";
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Spin,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import {
  getDeviceList,
  getChannelList,
  getMp4RecordFile,
  getMp4Record,
} from "../apis";

type SizeType = Parameters<typeof Form>[0]["size"];

const Record: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [recordList, setRecordList] = useState<any[]>([]);
  const [channelList, setChannelList] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const { data, error, loading } = useRequest(
    async () => await getDeviceList()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    throw error;
  }
  const deviceList = Object.values(data?.data.data).map((item: unknown) =>
    JSON.parse(typeof item === "string" ? item : JSON.stringify(item))
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const onSearchRecord = async (values: any) => {
    values.date = dayjs(values.date).format("YYYY-MM-DD");
    let record = [];
    // 先查询设备所有通道
    const { deviceId, date, position } = values;
    const channelList = await getChannelList(deviceId);
    const channels = channelList?.data?.data;
    setChannelList(channels);
    for (const channel of channels) {
      const { channelId, deviceId } = channel;
      const stream = `${deviceId}_${channelId}`;
      const recordLists = await getMp4RecordFile("rtp", stream, date);
      const paths = recordLists?.data?.data?.data.rootPath.split("/");
      const len = paths.length;
      const item = {
        channelId,
        path: recordLists?.data?.data?.data.paths,
        app: paths[len - 4],
        stream: paths[len - 3],
        date: paths[len - 2],
      };
      console.log(item);
      record.push(item);
    }
    if (record.length === 0) {
      messageApi.info("没有找到录像");
      setChannelList([]);
      setRecordList([]);
      return;
    }
    setRecordList(record);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handlePlayRecord = async ({
    app,
    stream,
    date,
    fileName,
  }: {
    app: string;
    stream: string;
    date: string;
    fileName: string;
  }) => {
    const url = getMp4Record({ app, stream, date, fileName });
    setCurrentVideo(url);
  };

  return (
    <div className="flex gap-8">
      <div className=" w-1/4 flex flex-col">
        {contextHolder}
        <Form
          layout="horizontal"
          initialValues={{
            size: componentSize,
            position: "server",
            startAt: dayjs(),
            endAt: dayjs(),
          }}
          onValuesChange={onFormLayoutChange}
          size={componentSize as SizeType}
          style={{ maxWidth: 800 }}
          onFinish={onSearchRecord}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="摄像头"
            name="deviceId"
            rules={[{ required: true, message: "请选择设备" }]}
          >
            <Select>
              {deviceList.map((device) => (
                <Select.Option value={device.deviceId} key={device.deviceId}>
                  {device.deviceName}@{device.deviceId}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="选择日期"
            name="date"
            rules={[{ required: true, message: "请选择时间" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="存储位置" name="position">
            <Radio.Group>
              <Radio.Button value="server">服务器</Radio.Button>
              <Radio.Button value="device">设备</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="default" className=" w-full" htmlType="submit">
              搜索录像
            </Button>
          </Form.Item>
        </Form>
        <div className=" text-xl font-bold">录像列表</div>
        <div>
          {recordList.map((record) => (
            <div
              key={record.channelId}
              className="flex justify-between flex-col  py-2"
            >
              <div className="border-b border-gray-200 pb-4">
                {record.channelId}
              </div>
              <div className="flex gap-2 flex-col">
                {record.path?.map((path: string) => (
                  <div className="flex" key={path}>
                    <div className="flex justify-center items-center">
                      {path}
                    </div>
                    <div className="flex justify-center items-center">
                      <Button
                        type="link"
                        onClick={() =>
                          handlePlayRecord({
                            app: record.app,
                            stream: record.stream,
                            date: record.date,
                            fileName: path,
                          })
                        }
                      >
                        播放
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className=" flex">
        {currentVideo && (
          <video id="video" width="600" height="360" controls>
            <source src={currentVideo} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

export default Record;
