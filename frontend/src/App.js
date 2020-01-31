import "./style.css";
import React from "react";
import ReactPlayer from "react-player";
import Chat from "./Chat";

const App = () => {
  return (
    <>
      <div>
        <h2 id="header"> 🍕Pizza Day Live Camera & chat🍕 </h2>
      </div>
      <div id="content">
        <div id="video-player">
          <ReactPlayer
            url={`http://${process.env.MEDIA_STREAM_ADDRESS}:${process.env.MEDIA_STREAM_PORT}/live/${process.env.STREAM_KEY}/index.m3u8`}
            playing
            controls={false}
            volume={0}
            height="100%"
            width="100%"
          />
        </div>
        <Chat />
      </div>
    </>
  );
};

export default App;
