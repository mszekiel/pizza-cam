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

const ChatNotification = props => {
  const { content } = props;
  return (
    <div className='chat__message'>
      <div className='chat__notification'>
        {content.user && <User userID={content.user} />}
        <span className='chat__notification--text'>{content.message}</span>
      </div>
    </div>
  )
}

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
      host: "ws://10.42.3.36:2137", // CHAT HOST
      onMessage: this.messageReceived,
    }).then(socket => {
      this.setState({ socket });
    });
  };

  addNotification = content => {
    this.setState({
      messages: [
        <ChatNotification content={content} />
      ].concat(this.state.messages)
    })
  }

  messageReceived = message => {
    console.log(message)
    const { type, content } = message;
    switch (type) {
      case 'MESSAGE':
        this.addMessage(content.message, content.userID);
        break;
      case 'NOTIFICATION':
        console.log('notify')
        this.addNotification(content);
        break;
      default:
        break;
    }
  };

  addMessage = (message, userID, activeUser = false) => {
    if (activeUser) {
      this.state.socket.sendMessage(message);
    }
    this.setState({
      messages: [
        <ChatMessage key={uuid()} userID={userID} message={message} activeUser={activeUser} />
      ].concat(this.state.messages)
    })
  }

  handleMessageSend = () => {
    if (this.textInput.value !== '') {
      this.addMessage(this.textInput.value, this.state.socket.userID, true);
      this.textInput.value = '';
    }
  }

  render() {
    const { socket, messages } = this.state;
    return (
      <div id="chat__container">
        <div className="chat__container--offline" />
        <div className="chat__container--messages ">
          {messages}
        </div>
        <div id="chat__container--input">
          {socket.userID.length >= 15 && (
            <User userID={socket.userID} />
          )}
          <span className='chat__container--messageText'>MESSAGE:</span>
          <input id="chat__containter--inputField" ref={el => this.textInput = el} onKeyDown={e => e.key == 'Enter' && this.handleMessageSend()} maxLength="90" />
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
