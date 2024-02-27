import request from "./request";
export async function register({
  username,
  password,
  confirm,
}: {
  username: string;
  password: string;
  confirm: string;
}) {
  return await request.post("/user/register", {
    username,
    password,
    confirm
  });
}

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

export async function deleteUser( username: string) {
  return await request.post(
    "/user/delete",
    { username },
  );
}

export async function getPlatformConfig() {
  return await request.get("/config/list");
}

export async function getDeviceList() {
  return await request.get("/device/list");
}

export async function getUserList() {
  return await request.get("/user/list");
}

export async function testInvite(deviceId: string) {
  return await request.post("/device/invite", {
    deviceId,
  });
}