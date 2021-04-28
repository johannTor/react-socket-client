import React, { useState, useEffect } from 'react';
import socket from '../socket';

export default function Chat({userName}) {
  const [userList, setUserList] = useState([]);
  const [messages, setMessages] = useState([{user: 'john', content: 'Hello dude'}, {user: 'hallur', content: 'heyo'}]);
  const [message, setMessage] = useState('');

  /* Add use effect here to set the 'get message' event listener */

  useEffect(() => {
    socket.on("connect", () => {
      userList.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
    });

    socket.on("disconnect", () => {
      userList.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });

    // Only sent to each instance once, upon connection
    socket.on('users', (users) => {
      setUserList(users);
    });

    // Sent to everyone besides the connecting user
    socket.on('user connected', function (user) {
      setUserList([...userList, user]);
    });

    socket.on('user disconnected', (id) => {
      const cpyArr = [...userList];
      const foundUser = cpyArr.findIndex((item) => item.userID === id);
      if(foundUser !== -1) {
        cpyArr.splice(foundUser, 1);
        setUserList(cpyArr);
      } else {
        console.log('user not found');
      }
    });
    // Clean up listeners
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('users');
      socket.off('user connected');
      socket.off('user disconnected');
    }
  }, [userList]);

  /* Implement this function, should emit an event that the server is listening to */
  const sendMessage = () => {
    console.log('Send this message: ', message);
  };

  return (
    <div className="chatPage">
      <h1>ChatApp</h1>
      <div className="chatWindow">
        <div className="chatMessages">
          {messages.map((msg, index) => <div key={index}>{msg.user}: {msg.content}</div>)}
        </div>
        <input type="text" className="chatInput" placeholder="Enter message" value={message} onChange={(ev) => setMessage(ev.target.value)} onKeyPress={(ev) => ev.key === 'Enter' ? sendMessage(ev) : null}/>
      </div>
      <div className="userList">
        <h2>Users</h2>
        {userList.map((user, index) => <div key={index}>{user.username}</div>)}
      </div>
    </div>
  )
}
