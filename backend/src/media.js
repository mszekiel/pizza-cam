const NodeMediaServer = require('node-media-server');

const config = {
    logType: 2,
    rtmp: {
        port: 56665,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        allow_origin: '*',
        mediaroot: './media'
    },
    trans: {
        ffmpeg: 'C:/software/ffmpeg/bin/ffmpeg.exe',
        tasks: [{
            app: 'live',
            hls: true,
            hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        }]
    }
};

var nms = new NodeMediaServer(config)

const run = () => {
    nms.run();
}


export default { run }; 