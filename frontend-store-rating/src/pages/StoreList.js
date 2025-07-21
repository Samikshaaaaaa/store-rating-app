import React, { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [rating, setRating] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: "", address: "" });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    // Fetch user's ratings for all stores after stores are loaded
    if (stores.length > 0) {
      stores.forEach((store) => {
        fetchUserRating(store.id);
      });
    }
  }, [stores]);

  const fetchStores = async () => {
    try {
      const query = new URLSearchParams();
      if (search.name) query.append("name", search.name);
      if (search.address) query.append("address", search.address);

      const res = await api.get("/stores?" + query.toString());
      setStores(res.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load stores");
    }
  };

  const fetchUserRating = async (storeId) => {
    try {
      const res = await api.get(`/ratings/user/${storeId}`);
      if (res.data && res.data.rating) {
        setRating((prev) => ({ ...prev, [storeId]: res.data.rating }));
      }
    } catch (err) {
      // Ignore errors for individual ratings
    }
  };

  const submitRating = async (storeId) => {
    if (!rating[storeId]) {
      alert("Please enter a rating between 1 and 5");
      return;
    }

    try {
      await api.post(`/ratings/${storeId}`, { rating: rating[storeId] });
      alert("Rating submitted/updated!");
    } catch (err) {
      console.error("Submit rating error:", err);
      alert("Error submitting rating: " + (err.response?.data?.message || err.message || "Unknown error"));
    }
  };

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchStores();
  };

  if (loading) return <p>Loading stores...</p>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Available Stores</h2>
        <form onSubmit={handleSearchSubmit} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            name="name"
            placeholder="Search by store name"
            value={search.name}
            onChange={handleSearchChange}
            style={{ marginRight: "0.5rem" }}
          />
          <input
            type="text"
            name="address"
            placeholder="Search by address"
            value={search.address}
            onChange={handleSearchChange}
            style={{ marginRight: "0.5rem" }}
          />
          <button type="submit">Search</button>
        </form>
        {stores.map((store) => (
          <div key={store.id} className="store-card" style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
            <h4>{store.name}</h4>
            <p>{store.address}</p>
            <p>Average Rating: {store.averageRating}</p>
            <p>Your Rating: {rating[store.id] || "Not rated"}</p>
            <input
              type="number"
              min="1"
              max="5"
              placeholder="Rate 1-5"
              value={rating[store.id] || ""}
              onChange={(e) =>
                setRating({ ...rating, [store.id]: parseInt(e.target.value) })
              }
              style={{ marginRight: "0.5rem" }}
            />
            <button onClick={() => submitRating(store.id)}>Submit Rating</button>
          </div>
        ))}
      </div>
    </div>
  );
}
