import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false); // Tryb edycji
    const navigate = useNavigate();

    // Pobieranie danych aktualnie zalogowanego użytkownika
    useEffect(() => {
        const email = localStorage.getItem('userEmail'); // Pobierz email zalogowanego użytkownika

        if (email) {
            axios.get('http://localhost:3001/user-profile', { params: { email } })
                .then(response => setUserData(response.data))
                .catch(err => console.error("Błąd pobierania danych użytkownika:", err));
        } else {
            console.error("Brak emaila użytkownika w localStorage.");
            alert("Nie jesteś zalogowany! Przekierowanie do logowania...");
            navigate('/login'); // Przekieruj na stronę logowania, jeśli brak emaila
        }
    }, [navigate]);

    // Obsługa zmian w polach edycji
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    // Zapisywanie zmian w bazie danych
    const handleSave = () => {
        axios.put('http://localhost:3001/update-profile', userData)
            .then(response => {
                alert("Dane zostały zaktualizowane pomyślnie!");
                setIsEditing(false); // Wyłączenie trybu edycji
            })
            .catch(err => {
                console.error("Błąd aktualizacji danych:", err);
                alert("Nie udało się zaktualizować danych.");
            });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Mój Profil</h1>
            {userData.name ? (
                <div className="card p-4 shadow">
                    <div className="form-group mb-3">
                        <label>Imię:</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name || ''}
                            onChange={handleChange}
                            className="form-control"
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email || ''}
                            className="form-control"
                            disabled
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Telefon:</label>
                        <input
                            type="text"
                            name="phone"
                            value={userData.phone || ''}
                            onChange={handleChange}
                            className="form-control"
                            disabled={!isEditing}
                        />
                    </div>

                    {/* Przycisk do edycji/zapisu */}
                    {isEditing ? (
                        <div className="text-center">
                            <button className="btn btn-success me-2" onClick={handleSave}>Zapisz</button>
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Anuluj</button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edytuj</button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center">Ładowanie danych...</p>
            )}

            {/* Przycisk Cofnij */}
            <div className="text-center mt-4">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cofnij</button>
            </div>
        </div>
    );
};

export default Profile;
