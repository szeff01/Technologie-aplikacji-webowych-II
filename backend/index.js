const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData'); // Import modelu użytkownika

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Połączono z bazą danych MongoDB"))
    .catch(err => console.error("❌ Błąd połączenia z MongoDB:", err));

// Model produktu
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// Endpoint rejestracji
app.post('/register', async (req, res) => {
    try {
        const { email, password, confirmPassword, name, phone } = req.body;

        if (!email || !password || !confirmPassword || !name || !phone) {
            return res.status(400).json("Wszystkie pola są wymagane.");
        }

        if (password !== confirmPassword) {
            return res.status(400).json("Hasła nie są zgodne.");
        }

        if (!/^\d{9,15}$/.test(phone)) {
            return res.status(400).json("Nieprawidłowy numer telefonu. Musi zawierać od 9 do 15 cyfr.");
        }

        const existingUser = await FormDataModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json("E-mail jest już zarejestrowany.");
        }

        const role = email === 'admin@gmail.com' ? 'admin' : 'user';

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

// Endpoint dodawania produktu
app.post('/add-product', async (req, res) => {
    try {
        const { name, price, description, category, quantity } = req.body;

        if (!name || !price || !description || !category || !quantity) {
            return res.status(400).json({ message: "Wszystkie pola są wymagane." });
        }

        const newProduct = new Product({ name, price, description, category, quantity });
        await newProduct.save();

        res.status(201).json({ message: "Produkt dodany pomyślnie!", product: newProduct });
    } catch (err) {
        console.error("Błąd dodawania produktu:", err);
        res.status(500).json({ message: "Wewnętrzny błąd serwera." });
    }
});


// Endpoint pobierania produktów
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error("Błąd pobierania produktów:", err);
        res.status(500).json({ message: "Wewnętrzny błąd serwera." });
    }
});


app.get('/user-profile', async (req, res) => {
    try {
        const { email } = req.query; // Pobierz email użytkownika z zapytania
        const user = await FormDataModel.findOne({ email });

        if (!user) return res.status(404).json({ message: "Użytkownik nie znaleziony" });

        res.status(200).json(user);
    } catch (error) {
        console.error("Błąd pobierania profilu:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});


// Endpoint aktualizacji produktu
app.put('/update-product/:id', async (req, res) => {
    try {
        const { id } = req.params; // Pobierz ID produktu z parametrów URL
        const { name, price, description, category, quantity } = req.body;

        // Walidacja wejścia
        if (!name || !price || !description || !category || !quantity) {
            return res.status(400).json({ message: "Wszystkie pola są wymagane." });
        }

        // Aktualizacja produktu
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, description, category, quantity },
            { new: true } // Zwróć zaktualizowany produkt
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Produkt nie został znaleziony." });
        }

        res.status(200).json({ message: "Produkt zaktualizowany pomyślnie!", product: updatedProduct });
    } catch (err) {
        console.error("Błąd aktualizacji produktu:", err);
        res.status(500).json({ message: "Wewnętrzny błąd serwera." });
    }
});


// Endpoint usuwania produktu
app.delete('/delete-product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Produkt usunięty pomyślnie!" });
    } catch (err) {
        console.error("Błąd usuwania produktu:", err);
        res.status(500).json({ message: "Wewnętrzny błąd serwera." });
    }
});


// Endpoint aktualizacji produktu
app.put('/update-product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category, quantity } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, description, category, quantity },
            { new: true }
        );

        res.status(200).json({ message: "Produkt zaktualizowany!", product: updatedProduct });
    } catch (err) {
        console.error("Błąd aktualizacji produktu:", err);
        res.status(500).json({ message: "Wewnętrzny błąd serwera." });
    }
});




// Uruchomienie serwera
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na http://127.0.0.1:${PORT}`);
});
