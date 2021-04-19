import React, { useState, useEffect } from 'react';
import socket from '../socket';

export default function Chat({userName}) {
  let [userList, setUserList] = useState([]);
  // Get the room name from querystring
  // const [room, setRoom] = useState([]);
  // const [dummy, setDummy] = useState('');

  const initReactiveProperties = (user) => {
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
  }

  useEffect(() => {
    console.log('The useEffect');
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
      console.log('User connected', user.username, 'into', user.room);
      console.log('Userlist now: ', userList);

      setUserList([...userList, user]);
      // setDummy('newDummy');
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
      console.log('The return');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('users');
      socket.off('user connected');
      socket.off('user disconnected');
    }
  }, [userList]);

  // useEffect(() => {
  //   console.log('Users: ', userList);
  // }, [userList])

  return (
    <div>
      <h1>Hello {userName}</h1>
      <div className="userList">
        {userList.map((user, index) => {
          if(user.connected) return <div key={index}>{user.username}</div>
          else return null
        })}
      </div>
    </div>
  )
}
