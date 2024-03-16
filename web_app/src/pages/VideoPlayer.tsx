import React from "react";
import { testVideo } from "../apis";
import { useRequest } from "ahooks";
import { Spin } from "antd";
import Player from "../components/MsePlayer";

function VideoPlayer() {
  const { data, error, loading } = useRequest(async () => await testVideo());

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

  const socketUrl = data?.data.data.url;
  return (
    <div>
      VideoPlayer
      <Player socketUrl={socketUrl} />
    </div>
  );
}

export default VideoPlayer;
