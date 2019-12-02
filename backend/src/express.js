import express from 'express';
import path from 'path';
import api from './api';

const app = express();
app.use(api);

app.use(express.static(path.resolve('../frontend/build')));

const bootstrap = (port = 9090) => {
    app.listen(port, () => {
        console.error(`[HTTP] Server listening on ${port}`);
    });
};

export default { bootstrap }; 