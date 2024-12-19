import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    let location;

    try {
        location = useLocation(); // Próbujemy uzyskać lokalizację
    } catch (e) {
        // Jeśli Router nie jest dostępny, nie renderujemy stopki
        return null;
    }

    // Wyświetl stopkę tylko na stronie "/home"
    if (location.pathname !== '/home') {
        return null;
    }

    return (
        <div className="footer-container">
            <p className="footer-text">© 2024 eSklep Internetowy. Wszystkie prawa zastrzeżone.</p>
            <div className="footer-links">
                <a href="#about">O nas</a>
                <a href="#contact">Kontakt</a>
                <a href="#terms">Regulamin</a>
            </div>
        </div>
    );
}
