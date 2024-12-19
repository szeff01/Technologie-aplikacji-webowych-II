const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData'); // Import modelu użytkownika

const app = express();

// Middleware
app.use(express.json()); // Umożliwia odczytywanie danych JSON
app.use(cors()); // Umożliwia żądania z innych domen (CORS)

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Połączono z bazą danych MongoDB"))
    .catch(err => console.error("❌ Błąd połączenia z MongoDB:", err));

// Endpoint rejestracji
app.post('/register', async (req, res) => {
    try {
        const { email, password, confirmPassword, name, phone } = req.body;

        // Walidacja danych wejściowych
        if (!email || !password || !confirmPassword || !name || !phone) {
            return res.status(400).json("Wszystkie pola są wymagane.");
        }

        // Sprawdzenie zgodności haseł
        if (password !== confirmPassword) {
            return res.status(400).json("Hasła nie są zgodne.");
        }

        // Sprawdzenie poprawności numeru telefonu
        if (!/^\d{9,15}$/.test(phone)) {
            return res.status(400).json("Nieprawidłowy numer telefonu. Musi zawierać od 9 do 15 cyfr.");
        }

        // Sprawdzenie czy użytkownik już istnieje
        const existingUser = await FormDataModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json("E-mail jest już zarejestrowany.");
        }

        // Ustawienie roli użytkownika (admin lub user)
        const role = email === 'admin@gmail.com' ? 'admin' : 'user';

        // Tworzenie nowego użytkownika
        const newUser = await FormDataModel.create({
            name,
            email,
            phone,
            password,
            role,
        });

        res.status(201).json({
            message: "Rejestracja zakończona sukcesem!",
            user: newUser,
        });
    } catch (err) {
        console.error("Błąd rejestracji:", err);
        res.status(500).json("Wewnętrzny błąd serwera.");
    }
});

// Endpoint logowania
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "Error", message: "E-mail i hasło są wymagane." });
        }

        const user = await FormDataModel.findOne({ email: email.trim() });

        if (!user) {
            return res.status(404).json({ status: "Error", message: "Użytkownik nie istnieje." });
        }

        if (user.password !== password) {
            return res.status(400).json({ status: "Error", message: "Nieprawidłowe hasło." });
        }

        res.status(200).json({ status: "Success", role: user.role, message: "Logowanie udane!" });
    } catch (err) {
        console.error("Błąd logowania:", err);
        res.status(500).json({ status: "Error", message: "Wewnętrzny błąd serwera." });
    }
});



// Uruchomienie serwera
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na http://127.0.0.1:${PORT}`);
});
