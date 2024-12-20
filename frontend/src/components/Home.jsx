import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Błąd pobierania produktów:', err);
        setError('Nie udało się załadować produktów.');
        setLoading(false);
      });

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const getCategoryImage = (category) => {
    if (!category) return '/photo/other.jpg';
    const imageName = category.toLowerCase().replace(/\s+/g, '') + '.jpg';
    return `/photo/${imageName}`;
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} został dodany do koszyka!`);
  };

  return (
    <div className="home-container">
      <div className="banner mb-4">
        <img src="/photo/banner.jpg" alt="Baner sklepu" className="banner-image" />
      </div>

      {/* Nagłówek i przyciski nawigacyjne */}
      <div className="header mb-4">
        <h1>Witamy w naszym sklepie internetowym!</h1>
        <div className="btn-container">
          <Link to="/profile" className="btn btn-custom">Mój profil</Link>
          <button className="btn btn-custom" onClick={() => navigate('/cart')}>Mój koszyk</button>
          <Link to="/login" className="btn btn-custom">Wyloguj się</Link>
        </div>
      </div>

      {loading && <p className="text-center">Ładowanie produktów...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="products-container row">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className="product-card card h-100 shadow-sm">
                <img
                  src={getCategoryImage(product.category)}
                  alt={product.category}
                  className="card-img-top"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Cena: {product.price} PLN</p>
                  <p className="card-text">Kategoria: {product.category}</p>
                  <p className="card-text">{product.description}</p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => addToCart(product)}
                  >
                    Dodaj do koszyka
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Brak produktów do wyświetlenia.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
