import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
    const [showForm, setShowForm] = useState(false);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState(''); // Kategoria
    const [customCategory, setCustomCategory] = useState('');   // Niestandardowa kategoria
    const [productQuantity, setProductQuantity] = useState(''); // Ilość produktu
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const categories = ['Elektronika', 'Odzież', 'Spożywcze', 'Książki', 'Inne'];

    // Pobieranie produktów
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Błąd pobierania produktów:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Dodawanie lub edycja produktu
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const categoryToSend = productCategory === 'Inne' ? customCategory : productCategory;

            if (editingProduct) {
                // Aktualizacja produktu
                await axios.put(`http://localhost:3001/update-product/${editingProduct._id}`, {
                    name: productName,
                    price: productPrice,
                    description: productDescription,
                    category: categoryToSend,
                    quantity: productQuantity,
                });
                alert('Produkt zaktualizowany!');
            } else {
                // Dodanie produktu
                await axios.post('http://localhost:3001/add-product', {
                    name: productName,
                    price: productPrice,
                    description: productDescription,
                    category: categoryToSend,
                    quantity: productQuantity,
                });
                alert('Produkt dodany!');
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Błąd zapisu produktu:', error);
            alert('Wystąpił błąd.');
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setProductCategory('');
        setCustomCategory('');
        setProductQuantity('');
        setEditingProduct(null);
    };

    // Usuwanie produktu
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/delete-product/${id}`);
            alert('Produkt usunięty!');
            fetchProducts();
        } catch (error) {
            console.error('Błąd usuwania produktu:', error);
        }
    };

    // Edycja produktu
    const handleEdit = (product) => {
        setEditingProduct(product);
        setProductName(product.name);
        setProductPrice(product.price);
        setProductDescription(product.description);
        setProductCategory(product.category);
        setProductQuantity(product.quantity);
        setShowForm(true);
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Panel Administratora</h1>
            <div className="admin-buttons">
                <Link to="/login" className="btn btn-danger">Wyloguj się</Link>
                <button className="btn btn-success" onClick={() => {
                    resetForm();
                    setShowForm(!showForm);
                }}>
                    {showForm ? "Anuluj" : "Dodaj produkt"}
                </button>
            </div>

            {/* Formularz dodawania / edycji produktu */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        type="text"
                        placeholder="Nazwa produktu"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="form-control mb-2"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Cena produktu"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="form-control mb-2"
                        required
                    />
                    <textarea
                        placeholder="Opis produktu"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="form-control mb-2"
                        required
                    />
                    <select
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        className="form-control mb-2"
                        required
                    >
                        <option value="">Wybierz kategorię</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {productCategory === 'Inne' && (
                        <input
                            type="text"
                            placeholder="Wprowadź kategorię"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="form-control mb-2"
                            required
                        />
                    )}
                    <input
                        type="number"
                        placeholder="Wprowadź ilość"
                        value={productQuantity}
                        onChange={(e) => setProductQuantity(e.target.value)}
                        className="form-control mb-2"
                        required
                    />
                    <button type="submit" className="btn btn-success w-100">
                        {editingProduct ? "Zaktualizuj produkt" : "Dodaj produkt"}
                    </button>
                </form>
            )}

            {/* Lista produktów */}
            <h3 className="mt-4">Lista produktów</h3>
            <ul className="list-group">
                {products.map((product) => (
                    <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{product.name}</strong> - {product.price} PLN
                            <p className="mb-0 text-muted">Kategoria: {product.category} | Ilość: {product.quantity}</p>
                            <p className="mb-0 text-muted">{product.description}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(product)} className="btn btn-warning btn-sm me-2">Edytuj</button>
                            <button onClick={() => handleDelete(product._id)} className="btn btn-danger btn-sm">Usuń</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
