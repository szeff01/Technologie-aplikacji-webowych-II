import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
    
        axios.post('http://localhost:3001/login', { email, password })
            .then((response) => {
                console.log("Odpowiedź serwera:", response.data);
    
                if (response.data.status === "Success") {
                    alert(`Zalogowano pomyślnie! Rola: ${response.data.role}`);
                    if (response.data.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/home');
                    }
                } else {
                    alert(response.data); // Obsługa komunikatu z serwera
                }
            })
            .catch((err) => {
                console.error("Błąd logowania:", err.response?.data || err.message);
                alert(`Błąd logowania: ${err.response?.data || "Nieznany błąd"}`);
            });
    };
    

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>🛒 eSklep Internetowy</h1>
                <p>Najlepsze miejsce na zakupy online!</p>
            </div>
            <div className="auth-box">
                <h2 className="auth-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Email Id</strong></label>
                        <input type="email" placeholder="Enter Email" className="form-control" onChange={(event) => setEmail(event.target.value)} required />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Password</strong></label>
                        <input type="password" placeholder="Enter Password" className="form-control" onChange={(event) => setPassword(event.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <p className="text-center mt-3">Don't have an account?</p>
                <Link to='/register' className="btn btn-secondary w-100">Register</Link>
            </div>
        </div>
    );
};

export default Login;
