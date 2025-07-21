import React, { useEffect, useState } from "react";
import api, { addUser, addStore } from "../api";
import Navbar from "../components/Navbar";

const containerStyle = {
  maxWidth: "1200px",
  margin: "20px auto",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const sectionStyle = {
  marginBottom: "30px",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
};

const listItemStyle = {
  cursor: "pointer",
  borderBottom: "1px solid #ccc",
  padding: "8px 5px",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "10px",
};

const labelStyle = {
  marginBottom: "5px",
  fontWeight: "bold",
};

const inputStyle = {
  padding: "8px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "8px 15px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white",
  cursor: "pointer",
  marginTop: "10px",
  alignSelf: "flex-start",
};

const modalStyle = {
  position: "fixed",
  top: "20%",
  left: "30%",
  width: "40%",
  backgroundColor: "white",
  border: "1px solid black",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "user" });
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setData(res.data);
      } catch (err) {
        alert("Failed to load admin data");
      }
    };
    loadData();
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  const filteredUsers = data.users.filter(user =>
    [user.name, user.email, user.address, user.role]
      .some(field => field.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredStores = data.stores.filter(store =>
    [store.name, store.email, store.address]
      .some(field => field.toLowerCase().includes(storeSearch.toLowerCase()))
  );

  const handleUserInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleStoreInputChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    try {
      await addUser(newUser);
      alert("User added successfully");
      setShowUserForm(false);
      setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
      const res = await api.get("/admin/dashboard");
      setData(res.data);
    } catch (err) {
      alert("Failed to add user: " + err.response?.data?.message || err.message);
    }
  };

  const handleAddStore = async () => {
    try {
      await addStore(newStore);
      alert("Store added successfully");
      setShowStoreForm(false);
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
      const res = await api.get("/admin/dashboard");
      setData(res.data);
    } catch (err) {
      alert("Failed to add store: " + err.response?.data?.message || err.message);
    }
  };


  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={headerStyle}>
        <h2>Admin Dashboard</h2>
      </div>

      <section style={sectionStyle}>
        <h4>Stats:</h4>
        <ul>
          <li>Total Users: {data.stats.totalUsers}</li>
          <li>Total Stores: {data.stats.totalStores}</li>
          <li>Total Ratings: {data.stats.totalRatings}</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h4>Users:</h4>
        <input
          placeholder="Search users..."
          onChange={(e) => setUserSearch(e.target.value)}
          style={inputStyle}
        />
        <button onClick={() => setShowUserForm(!showUserForm)} style={buttonStyle}>
          {showUserForm ? "Cancel" : "Add New User"}
        </button>
        {showUserForm && (
          <div style={{ marginTop: "10px", marginBottom: "20px" }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Name</label>
              <input
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={handleUserInputChange}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleUserInputChange}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleUserInputChange}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Address</label>
              <input
                name="address"
                placeholder="Address"
                value={newUser.address}
                onChange={handleUserInputChange}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Role</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleUserInputChange}
                style={inputStyle}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button onClick={handleAddUser} style={buttonStyle}>Add User</button>
          </div>
        )}
      </section>

      <section style={sectionStyle}>
        <h4>User List:</h4>
        {filteredUsers.map(user => (
          <div
            key={user.id}
            style={listItemStyle}
            onClick={() => setSelectedUser(user)}
          >
            {user.name} | {user.email} | {user.address} | {user.role}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h4>Stores:</h4>
        <input
          placeholder="Search stores..."
          onChange={(e) => setStoreSearch(e.target.value)}
          style={inputStyle}
        />
        <button onClick={() => setShowStoreForm(!showStoreForm)} style={buttonStyle}>
          {showStoreForm ? "Cancel" : "Add New Store"}
        </button>
        {showStoreForm && (
          <div style={{ marginTop: "10px", marginBottom: "20px" }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Name</label>
              <input
                name="name"
                placeholder="Name"
                value={newStore.name}
                onChange={handleStoreInputChange}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                name="email"
                placeholder="Email"
                value={newStore.email}
                onChange={handleStoreInputChange}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Address</label>
              <input
                name="address"
                placeholder="Address"
                value={newStore.address}
                onChange={handleStoreInputChange}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Owner</label>
              <select
                name="ownerId"
                value={newStore.ownerId}
                onChange={handleStoreInputChange}
                style={inputStyle}
              >
                <option value="">Select Owner</option>
                {data.users
                  .filter(user => user.role === "owner")
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
            <button onClick={handleAddStore} style={buttonStyle}>Add Store</button>
          </div>
        )}
      </section>

      <section style={sectionStyle}>
        <h4>Store List:</h4>
        {filteredStores.map(store => (
          <div key={store.id} style={listItemStyle}>
            {store.name} | {store.email} | {store.address} | Avg Rating: {store.averageRating}
          </div>
        ))}
      </section>

      {selectedUser && (
        <div style={modalStyle}>
          <h3>User Details</h3>
          <p><b>Name:</b> {selectedUser.name}</p>
          <p><b>Email:</b> {selectedUser.email}</p>
          <p><b>Address:</b> {selectedUser.address}</p>
          <p><b>Role:</b> {selectedUser.role}</p>
          {selectedUser.role === "owner" && (
            <p><b>Rating:</b> {selectedUser.rating || "N/A"}</p>
          )}
          <button onClick={() => setSelectedUser(null)} style={buttonStyle}>Close</button>
        </div>
      )}
    </div>
  );
}
