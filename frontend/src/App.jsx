import { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function fetchJson(path) {
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchJson("/users"),
      fetchJson("/orders"),
      fetchJson("/catalog")
    ])
      .then(([usersData, ordersData, catalogData]) => {
        setUsers(usersData.users || []);
        setOrders(ordersData.orders || []);
        setCatalog(catalogData.items || []);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div className="page">
      <header className="header">
        <h1>Microservices Dashboard</h1>
        <p>Frontend served via CDN, API via ECS services.</p>
      </header>

      {error && <div className="error">{error}</div>}

      <section>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Orders</h2>
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.quantity} × {order.item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Catalog</h2>
        <ul>
          {catalog.map((item) => (
            <li key={item.id}>
              {item.name} — ${item.price}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
