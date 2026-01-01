import { useEffect, useMemo, useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    userName: "",
    orderItem: "",
    orderQty: "1",
    catalogName: "",
    catalogPrice: "0",
  });

  const totals = useMemo(
    () => ({
      users: users.length,
      orders: orders.length,
      catalog: catalog.length,
    }),
    [users, orders, catalog]
  );

  const refreshAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, ordersData, catalogData] = await Promise.all([
        fetchJson("/users"),
        fetchJson("/orders"),
        fetchJson("/catalog"),
      ]);
      setUsers(usersData.users || []);
      setOrders(ordersData.orders || []);
      setCatalog(catalogData.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const postJson = async (path, payload) => {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    if (!formState.userName.trim()) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const record = await postJson("/users", { name: formState.userName });
      setUsers((prev) => [...prev, record]);
      setFormState((prev) => ({ ...prev, userName: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async (event) => {
    event.preventDefault();
    if (!formState.orderItem.trim()) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const record = await postJson("/orders", {
        item: formState.orderItem,
        quantity: Number(formState.orderQty || 1),
      });
      setOrders((prev) => [...prev, record]);
      setFormState((prev) => ({ ...prev, orderItem: "", orderQty: "1" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCatalog = async (event) => {
    event.preventDefault();
    if (!formState.catalogName.trim()) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const record = await postJson("/catalog", {
        id: `sku-${catalog.length + 1}`,
        name: formState.catalogName,
        price: Number(formState.catalogPrice || 0),
      });
      setCatalog((prev) => [...prev, record]);
      setFormState((prev) => ({ ...prev, catalogName: "", catalogPrice: "0" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteJson = async (path) => {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  };

  const handleRemoveUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteJson(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOrder = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteJson(`/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCatalog = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteJson(`/catalog/${id}`);
      setCatalog((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Microservices Dashboard</h1>
          <p>Frontend served via CDN, API via ECS services.</p>
        </div>
        <button className="primary" onClick={refreshAll} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh data"}
        </button>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>Users</span>
          <strong>{totals.users}</strong>
        </div>
        <div className="stat-card">
          <span>Orders</span>
          <strong>{totals.orders}</strong>
        </div>
        <div className="stat-card">
          <span>Catalog items</span>
          <strong>{totals.catalog}</strong>
        </div>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="panel">
        <h2>Users</h2>
        <form className="inline-form" onSubmit={handleAddUser}>
          <input
            name="userName"
            placeholder="Add a user"
            value={formState.userName}
            onChange={handleChange}
          />
          <button className="secondary" type="submit" disabled={loading}>
            Add
          </button>
        </form>
        <ul className="item-list">
          {users.map((user) => (
            <li key={user.id}>
              <span>{user.name}</span>
              <button
                className="icon-button"
                type="button"
                onClick={() => handleRemoveUser(user.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Orders</h2>
        <form className="inline-form" onSubmit={handleAddOrder}>
          <input
            name="orderItem"
            placeholder="Item name"
            value={formState.orderItem}
            onChange={handleChange}
          />
          <input
            name="orderQty"
            type="number"
            min="1"
            value={formState.orderQty}
            onChange={handleChange}
          />
          <button className="secondary" type="submit" disabled={loading}>
            Add
          </button>
        </form>
        <ul className="item-list">
          {orders.map((order) => (
            <li key={order.id}>
              <span>
                {order.quantity} × {order.item}
              </span>
              <button
                className="icon-button"
                type="button"
                onClick={() => handleRemoveOrder(order.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Catalog</h2>
        <form className="inline-form" onSubmit={handleAddCatalog}>
          <input
            name="catalogName"
            placeholder="Item name"
            value={formState.catalogName}
            onChange={handleChange}
          />
          <input
            name="catalogPrice"
            type="number"
            min="0"
            step="0.01"
            value={formState.catalogPrice}
            onChange={handleChange}
          />
          <button className="secondary" type="submit" disabled={loading}>
            Add
          </button>
        </form>
        <ul className="item-list">
          {catalog.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} — ${item.price}
              </span>
              <button
                className="icon-button"
                type="button"
                onClick={() => handleRemoveCatalog(item.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
