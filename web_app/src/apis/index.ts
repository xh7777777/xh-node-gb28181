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

export async function deleteDevice(deviceId: string) {
  return await request.post("/device/delete", {
    deviceId,
  });
}

export async function refreshDevice(deviceId: string) {
  return await request.post("/device/refresh", {
    deviceId,
  });
}

export async function getChannelList(deviceId: string) {
  return await request.post("/device/channel", {
      deviceId,
  });
}

export async function getChannelSession(deviceId: string, channelId: string) {

}

export async function deleteChannelVideo(deviceId: string, channelId: string, ttl = 0) {
  return await request.post("/device/deleteChannelVideo", {
    deviceId,
    channelId,
    ttl,
  });
}


export async function getUserList() {
  return await request.get("/user/list");
}

export async function testInvite(deviceId: string) {
  return await request.post("/device/invite", {
    deviceId,
  });
}

export async function closeInvite(deviceId: string, channelId: string) {
  return await request.post("/media/closeInvite", {
    deviceId,
    channelId,
  });
}

export async function testVideo() {
  return await request.get("/media/testVideo");
}

export async function getVideoUrl(deviceId: string, channelId: string) {
  return await request.post("/device/invite", {
    deviceId,
    channelId,
  });
}

export async function deviceControl(deviceId: string, channelId: string, action: string) {
  return await request.post("/device/deviceControl", {
    deviceId,
    channelId,
    action
  });
}