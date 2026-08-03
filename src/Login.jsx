





import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './AuthFile.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(
            "https://stilique-backend-production.up.railway.app/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        console.log("Status:", response.status);

        const text = await response.text();
        console.log("Response:", text);

        if (response.ok) {
            const data = JSON.parse(text);

            alert(data.message);
            localStorage.setItem("modamartUser", data.email);

            navigate("/home");
        } else {
            alert(text);
        }

    } catch (error) {
        console.error("Login Error:", error);
        alert(error.message);
    }
};

    return (
        <div className="auth-container">
            <div className="auth-box">
                <FaUserCircle className="auth-icon" />
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span></p>
            </div>
        </div>
    );
};

export default Login;
