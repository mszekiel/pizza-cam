const connect = options => {
  const socket = new WebSocket(options.host);

  return new Promise((resolve, reject) => {
    socket.addEventListener("open", event => {
      socket.send(JSON.stringify({ type: "OP_IDENTIFY" }));
    });

    const sendMessage = message => {
      socket.send(JSON.stringify({ type: "MESSAGE", content: message }));
    };

    socket.addEventListener("message", event => {
      const { type, content } = JSON.parse(event.data);
      switch (type) {
        case "OP_IDENTIFIED":
          socket.addEventListener("message", msg => {
            if (msg.data === "PING") {
              socket.send("PONG");
            } else {
              options.onMessage(JSON.parse(msg.data));
            }
          });
          resolve({ userID: content.userID, sendMessage });
          break;
        default:
          return;
      }
    });
  });
};

export default { connect };
