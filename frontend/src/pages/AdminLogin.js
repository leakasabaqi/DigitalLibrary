import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../admin/adminStyles.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/admin-login", {
        email,
        password,
      });
      console.log("Admin login successful", response.data);
      const loggedUser = response.data.user || response.data;
      localStorage.setItem("user", JSON.stringify(loggedUser));
      navigate("/admin", { state: { action: "login" } });
    } catch (err) {
      setError("Invalid admin credentials!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: 24,
      }}
    >
      <div
        className="card"
        style={{
          width: "min(520px, 100%)",
          padding: 34,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--accent)",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            A
          </div>
          <div>
            <div
              className="cardTitle"
              style={{ fontSize: "1.6rem", color: "white" }}
            >
              Admin Login
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              Authorized personnel only
            </div>
          </div>
        </div>

        <form style={{ display: "grid", gap: 16, marginTop: 28 }} onSubmit={handleSubmit}>
          {error ? (
            <div
              style={{
                padding: 12,
                borderRadius: "var(--radius-sm)",
                background: "rgba(239,68,68,0.15)",
                color: "#fca5a5",
                fontWeight: 600,
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {error}
            </div>
          ) : null}

          <label
            style={{
              display: "grid",
              gap: 8,
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.8)",
              fontWeight: 600,
            }}
          >
            Admin Email
            <input
              style={{
                width: "100%",
                minHeight: 46,
                padding: "0 14px",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "var(--radius-sm)",
                background: "rgba(255,255,255,0.06)",
                fontSize: "0.98rem",
                color: "white",
              }}
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email or username"
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: 8,
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.8)",
              fontWeight: 600,
            }}
          >
            Password
            <input
              style={{
                width: "100%",
                minHeight: 46,
                padding: "0 14px",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "var(--radius-sm)",
                background: "rgba(255,255,255,0.06)",
                fontSize: "0.98rem",
                color: "white",
              }}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
          </label>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px 18px",
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: "var(--accent)",
              color: "white",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            Access Admin Panel
          </button>
        </form>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.9rem",
          }}
        >
          <span>Not an admin?</span>
          <Link
            to="/login"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            User login
          </Link>
        </div>
      </div>
    </div>
  );
}
