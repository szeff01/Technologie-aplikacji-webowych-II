import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import AdminPanel from './AdminPanel';
import Profile from './Profile'; // Import nowego komponentu "Profile"
import Footer from './Footer';
import Cart from './Cart';

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/profile" element={<Profile />} /> 
                    <Route path="/cart" element={<Cart />} />
                </Routes>
                <ConditionalFooter /> {/* Footer wyświetlany warunkowo */}
            </div>
        </BrowserRouter>
    );
}

function ConditionalFooter() {
    const location = useLocation();
    return location.pathname === "/home" ? <Footer /> : null;
}

export default App;
