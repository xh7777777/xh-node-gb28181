import axios from "axios";

const request = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.PROD_URL
      : process.env.DEV_URL,
  timeout: 5000,
});

export function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return request.post("/user/login", {
    username,
    password,
  });
}

export function getUserInfo(token: string) {
  return request.get("/user/info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getDeviceList() {
  return request.get("/device");
}

export function getConfig() {}
