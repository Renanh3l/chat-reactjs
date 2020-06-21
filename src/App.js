import React, { useState } from 'react';
import io from 'socket.io-client';
import './App.css';

// dps ver se é melhor aqui ou um useeffect
const socket = io('https://chatjs-backend.herokuapp.com');

function App() {
  const [username, setUsername] = useState('');
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([]);

  socket.on('new message', data => {
    addChatMessage(data);
  })

  /**
   * Usa o nome de usuário para emitir o login
   */
  function handleInputKeyDown(event) {
    const ENTER_KEY = 13;

    if (event.which === ENTER_KEY) {
      socket.emit('add user', username);
    }
  }

  const addChatMessage = (data) => {
    setMessages([...messages, data])
  }

  function handleSendMessage(event) {
    const ENTER_KEY = 13;

    if (event.which === ENTER_KEY) {
      if (username && chatMsg) {
        event.target.value = ''; // Limpa o input
        addChatMessage({
          id: Date.now(),
          username: username,
          message: chatMsg
        });
        socket.emit('new message', chatMsg);
      }
    }
  }

  return (
    <div className="App">

      <header>
        <div className="login">
          <div className="form">
            <h3 className="title">What's your nickname?</h3>
            <input onChange={e => setUsername(e.target.value)} onKeyDown={handleInputKeyDown} className="usernameInput" type="text" maxLength="14" />
          </div>
        </div>
      </header>

      <div className="chat">
        <div className="chatArea">
          <ul className="messages">
            {messages.map(message => {
              return (
                <li key={message.id} className="message">
                  <span className="username">{message.username}</span>
                  <span className="messageBody">
                    {message.message}
                  </span>
                </li>
              )
            })}

          </ul>
        </div>
        <input onKeyDown={handleSendMessage} onChange={e => setChatMsg(e.target.value)} className="inputMessage" placeholder="Type here..." />
      </div>

    </div>
  );
}

export default App;
