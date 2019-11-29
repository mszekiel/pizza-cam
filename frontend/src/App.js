import './style.css';
import React from 'react';
import ReactPlayer from 'react-player';
import Chat from './Chat';

// MAIN ADDRESES
const PORT = process.env.NODE_ENV === 'development' ? 9080 : 80;
const ADDRESS = process.NODE_ENV === 'development' ? 'localhost' : '10.42.3.36';
const API_HOST = `${ADDRESS}:${PORT} `;
const VIDEO_HOST = `${ADDRESS}:8000`;


const App = () => {
    return (
        <>
            <div>
                <h2 id='header'> 🍕Pizza Day Live Camera🍕 </h2>
            </div>
            <div id='content'>
                <div id='video-player' >
                    <ReactPlayer url='http://localhost:8000/live/testing123/index.m3u8' playing controls height="100%" width='100%' />
                </div>
                <Chat />
            </div>
        </>
    )
}

export default App; 