import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../admin/adminStyles.css";

export default function Register() {
  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const inputStyle = {
    width: "100%",
    minHeight: 46,
    padding: "0 14px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    background: "#f9fafb",
    fontSize: "0.98rem",
    color: "var(--text)",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !emri ||
      !mbiemri ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Ju lutem plotesoni te gjitha fushat.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Fjalekalimet nuk perputhen.");
      return;
    }

    const role = adminCode.trim() === "ADMIN123" ? "admin" : "user";
    if (adminCode.trim() && role !== "admin") {
      setError("Kodi i adminit nuk është i saktë.");
      return;
    }

    setError("");

    try {
      const response = await axios.post("http://localhost:5000/users", {
        username,
        email,
        passwordHash: password,
        emri,
        mbiemri,
        roli: role,
      });

      console.log("Register successful", response.data);
      navigate("/login");
    } catch (err) {
      setError(
        "Gabim gjatë regjistrimit. Kontrolloni të dhënat dhe provoni përsëri.",
      );
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
            Registration
          </div>
          <div className="cardSubtitle">
            Create a new account to log in to the system.
          </div>
        </div>

        <form style={{ display: "grid", gap: 16 }} onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                gridColumn: "span 2",
                padding: 12,
                borderRadius: "var(--radius-sm)",
                background: "#fef2f2",
                color: "var(--danger)",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <label
            style={{
              display: "grid",
              gap: 8,
              fontSize: "0.95rem",
              color: "var(--text)",
              fontWeight: 600,
            }}
          >
            Name
            <input
              style={inputStyle}
              type="text"
              value={emri}
              onChange={(e) => setEmri(e.target.value)}
              placeholder="Name"
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
            Last Name
            <input
              style={inputStyle}
              type="text"
              value={mbiemri}
              onChange={(e) => setMbiemri(e.target.value)}
              placeholder="Last Name"
            />
          </label>

          <label
            style={{
              gridColumn: "span 2",
              display: "grid",
              gap: 8,
              fontSize: "0.95rem",
              color: "var(--text)",
              fontWeight: 600,
            }}
          >
            Username
            <input
              style={inputStyle}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </label>

          <label
            style={{
              gridColumn: "span 2",
              display: "grid",
              gap: 8,
              fontSize: "0.95rem",
              color: "var(--text)",
              fontWeight: 600,
            }}
          >
            Email
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
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
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            Confirm Password
            <input
              style={inputStyle}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
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
            Admin Code (optional)
            <input
              style={inputStyle}
              type="text"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Enter the admin code if you have one"
            />
          </label>

          <button
            type="submit"
            style={{
              gridColumn: "span 2",
              width: "100%",
              padding: "14px 18px",
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: "var(--accent)",
              color: "white",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Register
          </button>
        </form>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            color: "var(--muted)",
            fontSize: "0.95rem",
          }}
        >
          <span>Already have an account?</span>
          <Link
            to="/login"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
