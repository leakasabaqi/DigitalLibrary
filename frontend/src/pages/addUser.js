import React, { useState, useEffect } from "react";
import axios from "axios";

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    username: "",
    email: "",
    passwordHash: "",
    emri: "",
    mbiemri: "",
    roli: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Funksioni që mbush formën për editim
  const handleEdit = (u) => {
    setUser({
      id: u.id,
      username: u.username,
      email: u.email,
      passwordHash: "", // Passwordin e lëmë bosh për siguri
      emri: u.emri,
      mbiemri: u.mbiemri,
      roli: u.roli,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUpdate = user.id ? true : false;
    const url = isUpdate
      ? `http://localhost:5000/users/${user.id}`
      : "http://localhost:5000/users";
    const method = isUpdate ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert(isUpdate ? "Përdoruesi u përditësua!" : "Përdoruesi u shtua!");
        setUser({
          username: "",
          email: "",
          passwordHash: "",
          emri: "",
          mbiemri: "",
          roli: "user",
        });
        fetchUsers();
      }
    } catch (error) {
      alert("Gabim gjatë lidhjes!");
    }
  };

  const handleDelete = async (id) => {
    if (await window.confirm("A je i sigurt?")) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {user.id ? "Edit User" : "Add New User"}
            </div>
            <div className="cardSubtitle">
              {user.id
                ? "Update user account details"
                : "Create new user accounts for the library system"}
            </div>
          </div>
          <div className="help">{users.length} users</div>
        </div>
        <form onSubmit={handleSubmit} className="formGrid">
          <div className="field">
            <label className="label">Username *</label>
            <input
              name="username"
              value={user.username || ""}
              placeholder="Enter username"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="field">
            <label className="label">Email Address *</label>
            <input
              name="email"
              value={user.email || ""}
              type="email"
              placeholder="Enter email address"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {!user.id && (
            <div className="field">
              <label className="label">Password *</label>
              <input
                name="passwordHash"
                value={user.passwordHash || ""}
                type="password"
                placeholder="Enter password"
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          )}

          <div className="field">
            <label className="label">First Name *</label>
            <input
              name="emri"
              value={user.emri || ""}
              placeholder="Enter first name"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="field">
            <label className="label">Last Name *</label>
            <input
              name="mbiemri"
              value={user.mbiemri || ""}
              placeholder="Enter last name"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="field">
            <label className="label">User Role</label>
            <select
              name="roli"
              value={user.roli}
              onChange={handleChange}
              className="select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {user.id ? "Save Changes" : "Create User"}
            </button>
            {user.id && (
              <button
                type="button"
                onClick={() =>
                  setUser({
                    username: "",
                    email: "",
                    passwordHash: "",
                    emri: "",
                    mbiemri: "",
                    roli: "user",
                  })
                }
                className="btn btnGhost"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <div className="cardTitle">User Directory</div>
            <div className="cardSubtitle">View and manage all users</div>
          </div>
        </div>
        {users.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#718096" }}
          >
            No users yet. Create your first account above.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {users.map((u) => (
              <div
                key={u.id}
                style={{
                  padding: 12,
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: u.roli === "admin" ? "#2563eb" : "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      flexShrink: 0,
                    }}
                  >
                    {u.emri.charAt(0)}
                    {u.mbiemri.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {u.emri} {u.mbiemri}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#718096" }}>
                      @{u.username}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#4a5568",
                    marginBottom: 8,
                  }}
                >
                  {u.email}
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    background: u.roli === "admin" ? "#dbeafe" : "#dcfce7",
                    color: u.roli === "admin" ? "#1e40af" : "#15803d",
                    marginBottom: 10,
                  }}
                >
                  {u.roli}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleEdit(u)}
                    className="btn btnGhost"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="btn btnGhost"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUser;
