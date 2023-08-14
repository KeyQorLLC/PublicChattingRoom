import { response } from 'express';
import React, { useState } from 'react';
import Icon from '../assets/Icon.png'

interface ChildProps {
    setisLogin: (value: boolean) => void
    setisUser: (value: boolean) => void
    setsessionUsername: (value: string) => void
}

const LoginForm: React.FC<ChildProps> = ({ setisLogin, setisUser, setsessionUsername }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const response = await fetch("http://localhost:8080/user/login", {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            headers: {
                'Content-Type': 'text/plain',
                'Accept': '*/*'
            },
        })
        .then((response) => {
            if (!response.ok) {
                setisLogin(false)
                throw Error(response.statusText)
            }
            return response.json()
        })
        .then((data) => {
            setisLogin(false)
            setisUser(true)
            setsessionUsername(username)
            setUsername('');
            setPassword('');
        })
    } catch (error) { 
        console.error('Error sending data:', error)
    }
  }

  return (
    <div className="flex flex-col h-2/3 w-1/2 justify-center max-w-md mx-auto mb-10 bg-[#f5f5dc] text-[#171618] p-8 pt-0 rounded-lg shadow-lg">
      <div className='h-1/3 mt-0'>
        <img src={Icon} alt="icon"></img>
      </div>
      <h2 className="font-mono text-3xl mb-12">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="username" className="font-mono block text-[#171618] mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className="font-mono w-full bg-[#1c1c1e] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="font-mono block text-[#171618] mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="font-mono w-full bg-[#1c1c1e] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
          />
        </div>
        <button
          type="submit"
          className="font-mono w-full bg-[#1c1c1e] text-white py-2 px-4 rounded-lg hover:bg-[#1c1c1ee0]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;