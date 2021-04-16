import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import socket from './socket';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    socket.on('connect_error', (err) => {
      if(err.message === 'invalid username') {
        setIsLoggedIn(false);
        console.log('error: already exists', err);
      }
    });
    // Clean up listeners when app is dismounted?
    return () => {
      socket.off('connect_error');
    }
  }, []);

  const finishLogin = (userName) => {
    setIsLoggedIn(true);
    setUserName(userName);
    socket.auth = {userName};
    socket.connect();
  };

  return (
    <div className="App">
      <h1>ChatApp</h1>
      {!isLoggedIn ? <Login finishLogin={finishLogin}/> : <Chat userName={userName}/>}
    </div>
  );
}

export default App;
