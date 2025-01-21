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

  // Funkcja zmieniająca ilość produktu w koszyku
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return; // Zapobiega ustawieniu ilości mniejszej niż 1

    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;

    // Zapisanie zmienionego koszyka do localStorage
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Aktualizacja sumy
    const updatedTotal = updatedCart.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotal(updatedTotal);
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
    setTotal(0);
    alert('Koszyk został wyczyszczony!');
  };

  const removeItem = (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Aktualizacja sumy
    const updatedTotal = updatedCart.reduce((sum, product) => sum + product.price, 0);
    setTotal(updatedTotal);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Mój Koszyk</h1>

      {cart.length > 0 ? (
        <div>
          <ul className="list-group mb-4">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex  align-items-center">
                <span className="w-20">
                  {item.name} - {item.price} PLN
                </span>

                {/* ################################################################## */}
                <div className="d-flex align-items-center w-50 gap-2 justify-content-between">
                  {/* Przycisk do zmniejszenia ilości */}
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    -
                  </button>
                  {/* Wyświetlanie ilości */}
                  <span>{item.quantity}</span>

                  {/* Przycisk do zwiększenia ilości */}
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    +
                  </button>


                <button
                  className="btn btn-sm btn-danger"
                  style={{ width: '20%' }}
                  onClick={() => removeItem(index)}
                >
                  Usuń
                </button>

                </div>

              </li>
            ))}
          </ul>
          <h4 className="text-end mb-4">Suma: <span className="fw-bold">{total} PLN</span></h4>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-danger" onClick={clearCart}>Wyczyść koszyk</button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cofnij</button>
            <button className="btn btn-success" onClick={"#"}>Kup teraz</button>
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
