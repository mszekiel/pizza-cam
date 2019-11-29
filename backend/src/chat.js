import WebSocket from "ws";
import uuid from "uuid/v4";
import { CLIENT_RENEG_LIMIT } from "tls";

const start = port => {
  const server = new WebSocket.Server({ port });

  const uuids = new Map([]);


  const sendUUID = (ws, client) => {
    const id = uuid();
    console.log(`[IDENTIFIED] ADDRESS: ${client} ID: ${id}`);
    uuids.set(client, id);
    ws.send(
      JSON.stringify({
        type: "OP_IDENTIFIED",
        content: { userID: id }
      })
    );
  };

  const broadcastMessage = (ws, message, clientID) => {
    server.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const id = uuids.get(clientID)
        if (id) {
          client.send(JSON.stringify({
            type: 'MESSAGE',
            content: {
              message: message.content,
              userID: id,
            }
          }));
        }
      }
    });
  }

  server.on("connection", (ws, request) => {
    const client = request.connection.remoteAddress;
    ws.on("message", _message => {
      if (_message === "OP_IDENTIFY") {
        sendUUID(ws, client);
      } else {
        const message = JSON.parse(_message);
        switch (message.type) {
          case 'MESSAGE':
            console.log(`[MESSAGE] ADDRES: ${client} CONTENT: ${message.content}`);
            broadcastMessage(ws, message, client);
            break;
          default:
            break;
        }
      }
    });
  });
};

export default { start };
