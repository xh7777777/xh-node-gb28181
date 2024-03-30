import React from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Button } from "antd";
import FLVPlayer from "./FlvPalyer";

function MsePlayer({ socketUrl }: { socketUrl: string }) {
  const [socket, setSocket] = React.useState(socketUrl);
  const [message, setMessage] = React.useState("");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socket);
  console.log(socket)

  React.useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage)
      setMessage(lastMessage.data);
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = React.useCallback(
    (url: string) => setSocket(url),
    []
  );

  const handleClickSendMessage = React.useCallback(
    () => sendMessage("Hello"),
    []
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  return (
    <div>
      Player
      <div>播放地址:{socketUrl}</div>
        <FLVPlayer url={socket} type={`flv`} isLive={true} muted={true} controls={true} autoPlay={true}/>
    </div>
  );
}

export default MsePlayer;
