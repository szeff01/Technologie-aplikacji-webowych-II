import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Sprawdzenie zgodności haseł
        if (password !== confirmPassword) {
            alert("Hasła nie są zgodne!");
            return;
        }

        // Sprawdzenie numeru telefonu
        if (!/^\d{9,15}$/.test(phone)) {
            alert("Numer telefonu musi zawierać od 9 do 15 cyfr.");
            return;
        }

        // Sprawdzenie akceptacji regulaminu
        if (!acceptTerms) {
            alert("Musisz zaakceptować regulamin, aby się zarejestrować.");
            return;
        }

        try {
            // Logowanie danych przed wysłaniem żądania
            console.log({
                name: `${name} ${lastName}`,
                email,
                phone,
                password,
                confirmPassword,
            });

            // Wysłanie danych do serwera
            const response = await axios.post('http://localhost:3001/register', {
                name: `${name} ${lastName}`,
                email,
                phone,
                password,
                confirmPassword,
            });

            alert(response.data.message || "Rejestracja zakończona sukcesem!");
            navigate('/login'); // Przekierowanie na stronę logowania
        } catch (error) {
            console.error("Błąd rejestracji:", error.response?.data || error.message);
            alert(`Błąd rejestracji: ${error.response?.data || "Nieznany błąd"}`);
        }
    };

    return (
        <div className="register-container">
            <div className="register-header">
                <h1>🛒 eSklep Internetowy</h1>
                <p>Zarejestruj się i dołącz do najlepszych zakupów online!</p>
            </div>
            <div className="register-box">
                <h2 className="register-title">Rejestracja</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Imię</strong></label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Wpisz swoje imię" 
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Nazwisko</strong></label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Wpisz swoje nazwisko" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Adres e-mail</strong></label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Wpisz adres e-mail" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Numer telefonu</strong></label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Wpisz numer telefonu" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Hasło</strong></label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Wpisz hasło" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label"><strong>Potwierdź hasło</strong></label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Potwierdź hasło" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-check mb-3 text-start">
                        <input 
                            type="checkbox" 
                            className="form-check-input" 
                            id="terms" 
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)} 
                        />
                        <label className="form-check-label" htmlFor="terms">
                            Akceptuję regulamin
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Zarejestruj się</button>
                </form>
                <p className="text-center mt-3">Masz już konto?</p>
                <Link to='/login' className="btn btn-secondary w-100">Zaloguj się</Link>
            </div>
        </div>
    );
};

export default Register;
