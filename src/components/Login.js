import React, { useState } from 'react'

export default function Login({finishLogin}) {
  const [userName, setUsername] = useState('');

  const handleLogin = () => {
    if(!userName || userName === '') {
      console.log('Enter a username...');
      return;
    }
    finishLogin(userName);
  };

  return (
    <div>
      <input type="text" onChange={(ev) => setUsername(ev.target.value)} placeholder="Username..." />
      <button type="button" onClick={() => handleLogin()}>Login</button>
    </div>
  )
}
