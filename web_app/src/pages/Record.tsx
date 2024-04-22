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
} from "antd";
import dayjs from 'dayjs';
import { useRequest } from "ahooks";
import { getDeviceList } from "../apis";

type SizeType = Parameters<typeof Form>[0]["size"];

const Record: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
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

  const onSearchRecord = (values: any) => {
    console.log(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex">
      <div className=" w-1/4 flex flex-col">
        <Form
          layout="horizontal"
          initialValues={{ size: componentSize, position: "server", startAt: dayjs(), endAt: dayjs()}}
          onValuesChange={onFormLayoutChange}
          size={componentSize as SizeType}
          style={{ maxWidth: 800 }}
          onFinish={onSearchRecord}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="摄像头" name="deviceId" rules={[{ required: true, message: '请选择设备' }]}>
            <Select>
              {deviceList.map((device) => ( 
                <Select.Option value={device.deviceId} key={device.deviceId}>{device.deviceName}@{device.deviceId}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="开始时间" name="startAt" rules={[{ required: true, message: '请选择开始时间' }]}>
            <DatePicker className="w-full" showTime  />
          </Form.Item>
          <Form.Item label="结束时间" name="endAt" rules={[{ required: true, message: '请选择结束时间' }]}>
            <DatePicker className="w-full" showTime />
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
        <div>录像列表</div>
      </div>
    </div>
  );
};

export default Record;
