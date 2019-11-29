import "./chat.css";
import React from "react";
import socket from "./chatController";
import Identicon from "identicon.js";
import uuid from 'uuid/v4';

const User = props => {
  const { userID } = props;
  const data = new Identicon(userID, {
    margin: 0.15,
    size: 64,
    stauration: 1,
    background: [255, 255, 255, 255],
    format: "svg"
  }).toString();

  return (
    <div className="chat__user">
      <img
        width="32px"
        height="32px"
        src={`data:image/svg+xml;base64,${data}`}
      />
    </div>
  );
};

const ChatMessage = props => {
  const { message, userID, activeUser } = props;
  return (
    <div
      className={
        activeUser ? "chat__message chat__message--reverse" : "chat__message"
      }
    >
      <User userID={userID} />
      <div
        className={
          activeUser
            ? "chat__box chat__box--reverse"
            : "chat__box chat__box--default"
        }
      >
        <span className="chat__box--text">{message}</span>
      </div>
    </div>
  );
};

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: {
        userID: '',
        sendMessage: () => { }
      },
      messages: [],
    };
    this.textInput;
  }


  componentDidMount() {
    this.instantiateWebSocket();
  }

  instantiateWebSocket = async () => {
    socket.connect({
      host: "ws://localhost:2137", // CHAT HOST
      onMessage: this.messageReceived,
    }).then(socket => {
      this.setState({ socket });
    });
  };

  messageReceived = message => {
    const { type, content } = message;
    if (type === 'MESSAGE') {
      this.setState({
        messages: this.state.messages.concat([
          { userID: content.userID, message: content.message, activeUser: false }
        ])
      });
    }
  };

  addMessage = message => {
    this.state.socket.sendMessage(message);
    this.setState({
      messages: [
        { userID: this.state.socket.userID, message, activeUser: true }
      ].concat(this.state.messages)
    })
  }

  handleMessageSend = () => {
    if (this.textInput.value !== '') {
      this.addMessage(this.textInput.value);
      this.textInput.value = '';
    }
  }

  render() {
    const { socket, messages } = this.state;
    return (
      <div id="chat__container">
        <div className="chat__container--offline" />
        <div className="chat__container--messages ">{messages.map(msg => {
          return <ChatMessage key={uuid()} userID={msg.userID} message={msg.message} activeUser={msg.activeUser} />
        })}</div>
        <div id="chat__container--input">
          {socket.userID.length >= 15 && (
            <User userID={socket.userID} />
          )}
          <span className='chat__container--messageText'>MESSAGE:</span>
          <input id="chat__containter--inputField" ref={el => this.textInput = el} onKeyDown={e => e.key == 'Enter' && this.handleMessageSend()} maxLength="90"/>
          <div
            onClick={this.handleMessageSend}
            id="chat__containter--inputButton"
          >
            SEND
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
