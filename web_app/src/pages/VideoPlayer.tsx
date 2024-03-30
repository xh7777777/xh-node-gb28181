import React from "react";
import {  getVideoUrl } from "../apis";
import { useRequest } from "ahooks";
import { Spin } from "antd";
import Player from "../components/MsePlayer";
import { useLocation } from "react-router-dom";

function VideoPlayer() {
  const location = useLocation();
  const searchs = location.search.split("&");
  const deviceId = searchs[0].split("=")[1];
  const channelId = searchs[1].split("=")[1];

  const { data, error, loading } = useRequest(async () => await getVideoUrl(deviceId, channelId));

  console.log(data);

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

  const socketUrl = data?.data.data.prefix + '/' +  data?.data.data.url;
  return (
    <div>
      VideoPlayer
      <Player socketUrl={socketUrl} />
    </div>
  );
}

export default VideoPlayer;
