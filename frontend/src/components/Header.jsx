import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const accent = "#2563eb";
const borderColor = "rgba(15,23,42,0.10)";

const headerButton = {
  padding: "12px 20px",
  borderRadius: 18,
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
};

export default function Header({ showSidebar, sidebarNav, pathname, brandLink, hamburger, onHamburgerClick }) {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateUser = () =>
      setUser(JSON.parse(localStorage.getItem("user")));
    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const actions = user ? (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: isMobile ? "center" : "flex-end",
        width: isMobile ? "100%" : "auto",
      }}
    >
      <Link
        to="/browse"
        style={{
          ...headerButton,
          background: "transparent",
          color: "#0f172a",
          border: "none",
        }}
      >
        Browse
      </Link>
      {user.roli === "admin" ? (
        <Link
          to="/admin"
          style={{
            ...headerButton,
            background: accent,
            color: "white",
            border: "none",
            borderRadius: 12,
          }}
        >
          Admin Panel
        </Link>
      ) : (
        <Link
          to="/user-profile"
          style={{
            ...headerButton,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(37, 99, 235, 0.12)",
            color: accent,
            border: "1px solid rgba(37, 99, 235, 0.20)",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: accent,
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
            }}
          >
            {user.emri?.charAt(0).toUpperCase()}
          </span>
          Profile
        </Link>
      )}
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: isMobile ? "center" : "flex-end",
        width: isMobile ? "100%" : "auto",
      }}
    >
      <Link
        to="/browse"
        style={{
          ...headerButton,
          background: "transparent",
          color: "#0f172a",
          border: "none",
        }}
      >
        Browse
      </Link>
      <Link
        to="/login"
        style={{
          ...headerButton,
          background: "transparent",
          color: "#0f172a",
          border: "none",
        }}
      >
        Login
      </Link>
      <Link
        to="/register"
        style={{
          ...headerButton,
          background: accent,
          color: "white",
          border: "none",
          borderRadius: 12,
        }}
      >
        Sign Up to Read
      </Link>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        padding: "28px 24px 0",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          maxWidth: 1240,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "flex-start",
            gap: 10,
            width: isMobile ? "100%" : "auto",
          }}
        >
          {isMobile && hamburger && (
            <button
              onClick={onHamburgerClick}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
                color: "#0f172a",
                padding: "4px",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                marginRight: 4,
              }}
            >
              ☰
            </button>
          )}
          <Link
            to={brandLink || "/"}
            style={{
              fontWeight: 800,
              fontSize: 24,
              textDecoration: "none",
              color: "#0f172a",
            }}
          >
            Fletëza
          </Link>
        </div>
        {actions}
      </header>
      {isMobile && showSidebar && sidebarNav && sidebarNav.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 12,
            paddingBottom: 4,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          {sidebarNav.map((item) => (
            <Link key={item.to} to={item.to} style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  background:
                    pathname === item.to
                      ? "rgba(37,99,235,0.08)"
                      : "transparent",
                  color: pathname === item.to ? accent : "#334155",
                  fontWeight: pathname === item.to ? 700 : 600,
                  fontSize: 13,
                  border: `1px solid ${
                    pathname === item.to
                      ? "rgba(37,99,235,0.20)"
                      : "transparent"
                  }`,
                }}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
