import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../admin/adminStyles.css";

export default function Login() {
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
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log("Login successful", response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const redirectPath =
        response.data.user?.roli === "admin"
          ? "/admin-dashboard"
          : "/user-profile";
      navigate(redirectPath);
    } catch (err) {
      setError("Wrong credentials!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 24,
      }}
    >
      <div
        className="card"
        style={{
          width: "min(520px, 100%)",
          padding: 34,
          boxShadow: "var(--shadow-card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="cardHeader" style={{ marginBottom: 28 }}>
          <div
            className="cardTitle"
            style={{ fontSize: "2rem", letterSpacing: "-0.02em" }}
          >
            Login
          </div>
          {/* <div className="cardSubtitle">
            Hyni me llogarine tuaj.
          </div> */}
        </div>

        <form style={{ display: "grid", gap: 16 }} onSubmit={handleSubmit}>
          {error ? (
            <div
              style={{
                padding: 12,
                borderRadius: "var(--radius-sm)",
                background: "#fef2f2",
                color: "var(--danger)",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          ) : null}

          <label
            style={{
              display: "grid",
              gap: 8,
              fontSize: "0.95rem",
              color: "var(--text)",
              fontWeight: 600,
            }}
          >
            Email
            <input
              style={{
                width: "100%",
                minHeight: 46,
                padding: "0 14px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "#f9fafb",
                fontSize: "0.98rem",
                color: "var(--text)",
              }}
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email ose Username"
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: 8,
              fontSize: "0.95rem",
              color: "var(--text)",
              fontWeight: 600,
            }}
          >
            Password
            <input
              style={{
                width: "100%",
                minHeight: 46,
                padding: "0 14px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "#f9fafb",
                fontSize: "0.98rem",
                color: "var(--text)",
              }}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
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
            }}
          >
            Login
          </button>
        </form>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            color: "var(--muted)",
            fontSize: "0.95rem",
          }}
        >
          <span>Still don't have an account?</span>
          <Link
            to="/register"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
