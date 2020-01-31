import WebSocket from "ws";
import uuid from "uuid/v4";

const MESSAGE_TYPE = {
  OP_IDENTIFIED: "OP_IDENTIFIED",
  OP_IDENTIFY: "OP_IDENTIFY",
  MESSAGE: "MESSAGE",
  NOTIFICATION: "NOTIFICATION",
  PONG: "PONG",
  PING: "PING",
  ONLINE: "ONLINE"
};

const start = (port = 2137) => {
  const server = new WebSocket.Server({ port });

  // UUID MANAGEMENT
  const uuids = new Map([]);

  const createNewUUID = client => {
    const existingUUID = getUUID(client);
    if (existingUUID) return existingUUID;
    const address = client.connection.remoteAddress;
    const id = uuid();
    uuids.set(address, id);
    return id;
  };

  const getUUID = client => {
    const address = client.connection.remoteAddress;
    return uuids.get(address);
  };

  const sendUUID = (socket, client) => {
    const userID = getUUID(client);
    sendData(
      socket,
      JSON.stringify({ type: MESSAGE_TYPE.OP_IDENTIFIED, content: { userID } })
    );

    sendLastMessages(socket, client);
    notifyJoined(client);
  };

  const ping = () => {
    let online = 0;
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        online++;
      }
    });
    sendOnline(online);
  };

  setInterval(() => {
    ping();
  }, 2000);

  const sendOnline = online => {
    broadcastMessage(
      null,
      JSON.stringify({
        type: MESSAGE_TYPE.ONLINE,
        content: online
      })
    );
  };

  const getAddress = client => {
    return client.connection.remoteAddress;
  };

  // NOTIFICATIONS
  const notifyJoined = client => {
    console.log("[NOTIFICATION] New user joined", getAddress(client));
    broadcastMessage(
      false,
      JSON.stringify({
        type: MESSAGE_TYPE.NOTIFICATION,
        content: { user: getUUID(client), message: "NEW USER JOINED" }
      })
    );
  };

  // MESSAGE HANDLING
  const recentMessages = [];
  const LAST_MESS = 10;

  const sendLastMessages = (socket, client) => {
    for (let i = 0; i < recentMessages.length; i++) {
      sendData(
        socket,
        JSON.stringify({
          type: MESSAGE_TYPE.MESSAGE,
          content: {
            message: recentMessages[i].message,
            userID: recentMessages[i].userID
          }
        })
      );
    }
  };

  const pushMessage = (client, message) => {
    recentMessages.push({
      message: message.content,
      userID: getUUID(client)
    });
    if (recentMessages.length >= 10) {
      recentMessages.shift();
    }
  };

  const broadcastMessage = (sender, message) => {
    server.clients.forEach(client => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        sendData(client, message);
      }
    });
  };

  const sendMessage = (socket, client, message) => {
    pushMessage(client, message);
    broadcastMessage(
      socket,
      JSON.stringify({
        type: MESSAGE_TYPE.MESSAGE,
        content: {
          message: message.content,
          userID: getUUID(client)
        }
      })
    );
  };

  const sendData = (socket, message) => {
    socket.send(message);
  };

  const parseMessage = message => {
    try {
      return JSON.parse(message);
    } catch {
      return message;
    }
  };

  server.on("connection", (socket, client) => {
    socket.on("message", _message => {
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
        console.error(e);
      }
    });
  });
};

export default { start };
