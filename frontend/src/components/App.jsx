import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import AdminPanel from './AdminPanel';
import Footer from './Footer';

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Routes>
                <ConditionalFooter /> {/* Footer wyświetlany warunkowo */}
            </div>
        </BrowserRouter>
    );
}

// Komponent warunkowy dla Footer
function ConditionalFooter() {
    const location = useLocation(); // Pobiera aktualną ścieżkę
    return location.pathname === "/home" ? <Footer /> : null;
}

export default App;
