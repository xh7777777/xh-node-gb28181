import React from "react";
import Modal from "antd/es/modal/Modal";
import MsePlayer from "./MsePlayer";

function VideoPopUp({ socketUrl, show, handleCloseVideo }: { socketUrl: string; show: boolean, handleCloseVideo: () => void}) {

  return (
    // 遮罩层
    <Modal
      title="Basic Modal"
      open={show}
      onOk={() => {}}
      onCancel={handleCloseVideo}
      footer={null}
      width={1400}
    >
        <div className="h-[400px] md:h-[800px] overflow-auto">
            {socketUrl && <MsePlayer socketUrl={socketUrl} />}
        </div>
    </Modal>
  );
}

export default VideoPopUp;
