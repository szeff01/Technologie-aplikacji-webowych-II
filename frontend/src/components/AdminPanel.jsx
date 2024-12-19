import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
    return (
        <div className="container mt-5">
            <h1 className="text-center">Panel Administratora</h1>
            <p className="text-center">Witaj w panelu admina. Tylko uprawnieni użytkownicy mają dostęp.</p>

            <div className="text-center mt-4">
                <Link to="/home" className="btn btn-primary">Strona główna</Link>
                <Link to="/login" className="btn btn-danger ms-3">Wyloguj się</Link>
            </div>
        </div>
    );
};

export default AdminPanel;
