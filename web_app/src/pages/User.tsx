import React from "react";
import { useSelector } from "react-redux";
import { selectUserType } from "../store/configure";
import { useRequest } from "ahooks";
import { getUserList, deleteUser, register } from "../apis";
import {
  Spin,
  Table,
  TableProps,
  Button,
  Modal,
  message,
  Form,
  Input,
} from "antd";

interface DataType {
  key: string;
  no: number;
  username: string;
  userType: string;
}

type FieldType = {
  username?: string;
  password?: string;
  confirm?: string;
};

function User() {
  const userType = useSelector(selectUserType);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [registerModalOpen, setRegisterModalOpen] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { data, error, loading } = useRequest(
    async () => await getUserList()
  );
  const [deleteChoice, setDeleteChoice] = React.useState("");
  const [messageApi, contextHolder] = message.useMessage();

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

  const showModal = (text: any, record: any) => {
    setDeleteChoice(record.username);
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setDeleteChoice("");
  };

  const handleRegisterCancel = () => {
    setRegisterModalOpen(false);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "序号",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "用户类型",
      dataIndex: "userType",
      key: "userType",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => (
        <Button
          danger
          onClick={() => showModal(text, record)}
          disabled={(record.userType == '管理员') || (userType === 1 ? false : true)}
        >
          删除
        </Button>
      ),
    },
  ];
  const userList: DataType[] = data?.data?.data?.map(
    (item: { username: string; level: number }, index: number) => ({
      key: item.username,
      no: index + 1,
      username: item.username,
      // @ts-ignore
      userType: item.level === 1 ? "管理员" : "普通用户",
    })
  );

  const handleDelete = async (id: string) => {
    try {
      setConfirmLoading(true);
      const res = await deleteUser(id);
      if (res.data.errorCode !== 1) {
        throw new Error(res.data.errorMessage);
      }
      message.info("删除成功");
    } catch (e) {
      message.error("您没有权限");
    }
    setConfirmLoading(false);
    setModalOpen(false);
  };

  const handleRegister = async (values: any) => {
      try {
        setConfirmLoading(true);
        const { username, password, confirm } = values;
        const res = await register({ username, password, confirm });
        if (res.data.errorCode !== 1) {
          throw new Error(res.data.errorMessage);
        }
        messageApi.success("创建成功");
      } catch (e) {
        console.log(e);
        messageApi.error("创建失败");
      }
      setConfirmLoading(false);
      setRegisterModalOpen(false);
  };

  const handleRegisterConfirm = () => {
    buttonRef.current?.click();
  }

  return (
    <div>
      <Modal
        title="Title"
        open={modalOpen}
        onOk={() => handleDelete(deleteChoice)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{"确认删除?"}</p>
      </Modal>
      <Modal
        title="创建用户"
        open={registerModalOpen}
        onOk={handleRegisterConfirm}
        confirmLoading={confirmLoading}
        onCancel={handleRegisterCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleRegister}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            // 正则校验
            rules={[
              { required: true, message: "Please input your username!" },
              {
                pattern: /^[a-zA-Z0-9_]{4,18}$/,
                message:
                  "用户名长度必须在4-18位之间，包含字母数字，不能包含特殊字符",
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                pattern: /^[a-zA-Z0-9_]{8,18}$/,
                message:
                  "密码只能包含字母、数字和下划线、且长度必须在8-18位之间",
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="Confirm"
            name="confirm"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                pattern: /^[a-zA-Z0-9_]{8,18}$/,
                message:
                  "密码只能包含字母、数字和下划线、且长度必须在8-18位之间",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次密码不一致"));
                },
              }),
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button className="hidden" htmlType="submit" ref={buttonRef}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
      <div className="flex justify-between ">
        <span className=" font-bold text-lg mb-4">用户列表</span>{" "}
        <Button
          className={userType === 1 ? "" : "hidden"}
          onClick={() => setRegisterModalOpen(true)}
        >
          创建用户
        </Button>
      </div>
      <Table columns={columns} dataSource={userList} />
    </div>
  );
}

export default User;
