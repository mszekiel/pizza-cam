import './env';
import server from './express';
import chat from './chat';
import media from './media';


chat.start(process.env.CHAT_PORT);
server.bootstrap(process.env.SERVER_PORT);
media.run();
