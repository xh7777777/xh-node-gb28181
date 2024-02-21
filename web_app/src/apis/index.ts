import axios from "axios";

const request = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === "development"
      ? import.meta.env.VITE_PROD_URL
      : import.meta.env.VITE_DEV_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return await request.post("/user/login", {
    username,
    password,
  });
}

export async function getUserInfo(token: string) {
  return await request.get("/user/info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getPlatformConfig(token: string) {
  return await request.get("/config/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getDeviceList() {
  return request.get("/device");
}

export function getConfig() {}
