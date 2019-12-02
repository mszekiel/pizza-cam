import WebSocket from "ws";
import uuid from "uuid/v4";

const MESSAGE_TYPE = {
  OP_IDENTIFIED: 'OP_IDENTIFIED',
  OP_IDENTIFY: 'OP_IDENTIFY',
  MESSAGE: 'MESSAGE',
  NOTIFICATION: 'NOTIFICATION'
}

const start = port => {
  const server = new WebSocket.Server({ port });

  // UUID MANAGEMENT
  const uuids = new Map([]);

  const createNewUUID = (client) => {
    const existingUUID = getUUID(client);
    if (existingUUID)
      return existingUUID;
    const address = client.connection.remoteAddress;
    const id = uuid();
    uuids.set(address, id);
    return id;
  }

  const getUUID = (client) => {
    const address = client.connection.remoteAddress;
    return uuids.get(address);
  }

  const sendUUID = (socket, client) => {
    const userID = getUUID(client);
    sendData(
      socket,
      JSON.stringify({ type: MESSAGE_TYPE.OP_IDENTIFIED, content: { userID } })
    );

    notifyJoined(client);
  }

  // NOTIFICATIONS
  const notifyJoined = (client) => {
    console.log('[NOTIFICATION] New user joined');
    broadcastMessage(false, JSON.stringify({ type: MESSAGE_TYPE.NOTIFICATION, content: { user: getUUID(client), message: 'NEW USER JOINED' } }));
  }

  // MESSAGE HANDLINE
  const broadcastMessage = (sender, message) => {
    server.clients.forEach(client => {
      if ((client !== sender) && client.readyState === WebSocket.OPEN) {
        sendData(client, message);
      }
    });
  }

  const sendMessage = (socket, client, message) => {
    broadcastMessage(
      socket,
      JSON.stringify({
        type: MESSAGE_TYPE.MESSAGE,
        content: {
          message: message.content,
          userID: getUUID(client),
        }
      })
    )
  }

  const sendData = (socket, message) => {
    socket.send(message);
  }

  const parseMessage = (message) => {
    try {
      return JSON.parse(message);
    } catch {
      return message;
    }
  }

  server.on('connection', (socket, client) => {
    socket.on('message', _message => {
      const message = parseMessage(_message);
      try {
        switch (message.type) {
          case MESSAGE_TYPE.MESSAGE:
            sendMessage(socket, client, message);
            break;
          case MESSAGE_TYPE.OP_IDENTIFY:
            createNewUUID(client);
            sendUUID(socket, client, message);
            break;
        }
      } catch (e) {
        console.error(e)
      }
    });
  });
};

export default { start };
