import React, { useState, useEffect } from 'react';
import socket from '../socket';

export default function Chat({userName}) {
  let [userList, setUserList] = useState([]);
  const [dummy, setDummy] = useState('');

  const initReactiveProperties = (user) => {
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
  }

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
      console.log('Incoming users: ', users);
      users.forEach((user) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      setUserList(users);
    });

    socket.on('user connected', function (user) {
      initReactiveProperties(user);
      console.log('User connected', user.username);
      console.log('Userlist now: ', userList);

      // setUserList([...userList]);
      setDummy('newDummy');
    });

    socket.on('user disconnected', (id) => {
      for(let i = 0; i < userList.length; i++) {
        const user = userList[i];
        if(user.userID === id) {
          user.connected = false;
          break;
        }
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
  }, []);

  useEffect(() => {
    console.log('Users: ', userList);
  }, [userList, dummy])

  return (
    <div>
      <h1>Hello {userName}</h1>
    </div>
  )
}
