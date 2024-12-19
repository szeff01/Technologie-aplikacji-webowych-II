import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const products = [
  { id: 1, name: 'Laptop', price: 2999 },
  { id: 2, name: 'Telefon', price: 1999 },
  { id: 3, name: 'Słuchawki', price: 299 },
  { id: 4, name: 'Monitor', price: 999 },
];

const Home = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Witamy w naszym sklepie internetowym!</h1>
      
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3 mb-4" key={product.id}>
            <div className="card h-100 shadow">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Cena: {product.price} PLN</p>
                <button className="btn btn-primary mt-auto">Dodaj do koszyka</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Link to="/login" className="btn btn-danger">Wyloguj się</Link>
      </div>
    </div>
  );
};

export default Home;
