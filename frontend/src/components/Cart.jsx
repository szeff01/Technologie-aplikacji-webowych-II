import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);

    // Obliczanie sumy cen
    const totalPrice = storedCart.reduce((sum, product) => sum + product.price, 0);
    setTotal(totalPrice);
  }, []);

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
    setTotal(0);
    alert('Koszyk został wyczyszczony!');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Mój Koszyk</h1>

      {cart.length > 0 ? (
        <div>
          <ul className="list-group mb-4">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name} - {item.price} PLN
              </li>
            ))}
          </ul>
          <h4 className="text-end mb-4">Suma: <span className="fw-bold">{total} PLN</span></h4>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-danger" onClick={clearCart}>Wyczyść koszyk</button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cofnij</button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Twój koszyk jest pusty.</p>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>Przejdź do sklepu</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
