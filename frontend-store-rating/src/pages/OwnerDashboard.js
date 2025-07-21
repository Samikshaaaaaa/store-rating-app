import React, { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function OwnerDashboard() {
  const [storeData, setStoreData] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await api.get("/owner/ratings");
        setStoreData(res.data);
      } catch (err) {
        alert("Failed to load owner data");
      }
    };
    fetchRatings();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Store Owner Dashboard</h2>
      {storeData.map((store) => (
        <div key={store.id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem" }}>
          <h3>{store.name}</h3>
          <p>Average Rating: {store.averageRating}</p>
          <h4>Ratings by Users:</h4>
          {store.ratings.map((r) => (
            <p key={r.id}>User ID {r.userId}: {r.rating}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
