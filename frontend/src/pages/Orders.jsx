import React, { useState, useEffect } from 'react';
import Header from './Header';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from backend API
    fetch(`${import.meta.env.VITE_API_URL}/api/orders`)
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div>
      <Header />
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Order #{order.id} - ${order.total}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
