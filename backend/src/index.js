import server from './express';
import chat from './chat';
import media from './media';

const EXPRESS_PORT = 80;
const CHAT_PORT = 2137;

chat.start(CHAT_PORT);
server.bootstrap(EXPRESS_PORT);
media.run();
