import React from "react";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import { login } from "../apis";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { onLogin } from "../store/configure";
import useAuth from "../hooks/useAuth";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

function Login() {
  const [err, setErr] = React.useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useAuth();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spin size="large" />
      </div>
    );
  }

  if (status === "authenticated") {
    navigate("/");
  }

  const onFinish = async (values: any) => {
    const { username, password, remember } = values;
    try {
      const {data : res} = await login({ username, password });
      if (res.errorCode != 1) {
        throw new Error(res.data.errorMessage);
      } else {
        setErr("");
        if (remember) {
          localStorage.setItem("token", res.data.token);
        }
        dispatch(onLogin(res.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      setErr(error?.response?.data?.errorMessage || '登录出现错误');
    }
  };
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-100">
      <div className="p-8 rounded-lg shadow-lg h-96 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8">登录</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          // 正则校验
          rules={[{ required: true, message: "Please input your username!" }, {
            pattern: /^[a-zA-Z0-9_]{4,18}$/,
            message: "用户名长度必须在4-18位之间，包含字母数字，不能包含特殊字符"
          }]}
          validateTrigger="onBlur"
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }, {
            pattern: /^[a-zA-Z0-9_]{8,18}$/,
            message: "密码只能包含字母、数字和下划线、且长度必须在8-18位之间"
          }]}
          validateTrigger="onBlur"
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button className="bg-blue-400 text-white" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {err && <div className="text-red-500 text-center">{err}</div>}
      </div>
    </div>
  );
}

export default Login;
