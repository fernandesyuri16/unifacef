import {useState } from 'react';

import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3333/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })
        .then(resp => {
            return resp.json()
        })

        if (response.length >= 1) {
          // Navega para a rota '/produto'
            navigate('/produto', {state: {userId: response[0].id}});
        } else {
          alert('Usuário/senha inválidos');
        }
      };

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="bg-white p-8 rounded-lg drop-shadow-2xl w-96 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-2 font-semibold">
                        Username
                        </label>
                        <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 font-semibold">
                        Password
                        </label>
                        <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;