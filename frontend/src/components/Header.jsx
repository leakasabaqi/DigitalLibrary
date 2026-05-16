import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const accent = "#2563eb";

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

  const mobileBtn = isMobile
    ? { padding: "8px 14px", fontSize: 13, borderRadius: 10, minHeight: 36 }
    : {};

  const actions = user ? (
    <div
      style={{
        display: "flex",
        gap: isMobile ? 6 : 10,
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Link
        to="/browse"
        style={{
          ...mobileBtn,
          padding: mobileBtn.padding || "12px 20px",
          borderRadius: mobileBtn.borderRadius || 18,
          fontWeight: 700,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: mobileBtn.minHeight || 44,
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
            ...mobileBtn,
            padding: mobileBtn.padding || "12px 20px",
            borderRadius: mobileBtn.borderRadius || 12,
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: mobileBtn.minHeight || 44,
            background: accent,
            color: "white",
            border: "none",
          }}
        >
          Admin
        </Link>
      ) : (
        <Link
          to="/user-profile"
          style={{
            ...mobileBtn,
            padding: mobileBtn.padding || "12px 20px",
            borderRadius: mobileBtn.borderRadius || 12,
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: isMobile ? 6 : 10,
            justifyContent: "center",
            minHeight: mobileBtn.minHeight || 44,
            background: "rgba(37, 99, 235, 0.12)",
            color: accent,
            border: "1px solid rgba(37, 99, 235, 0.20)",
          }}
        >
          <span
            style={{
              width: isMobile ? 26 : 32,
              height: isMobile ? 26 : 32,
              borderRadius: "50%",
              background: accent,
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: isMobile ? 11 : 14,
              flexShrink: 0,
            }}
          >
            {user.emri?.charAt(0).toUpperCase()}
          </span>
          {isMobile ? "" : "Profile"}
        </Link>
      )}
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        gap: isMobile ? 6 : 10,
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Link
        to="/browse"
        style={{
          ...mobileBtn,
          padding: mobileBtn.padding || "12px 20px",
          borderRadius: mobileBtn.borderRadius || 18,
          fontWeight: 700,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: mobileBtn.minHeight || 44,
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
          ...mobileBtn,
          padding: mobileBtn.padding || "12px 20px",
          borderRadius: mobileBtn.borderRadius || 18,
          fontWeight: 700,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: mobileBtn.minHeight || 44,
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
          ...mobileBtn,
          padding: mobileBtn.padding || "12px 20px",
          borderRadius: mobileBtn.borderRadius || 12,
          fontWeight: 700,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: mobileBtn.minHeight || 44,
          background: accent,
          color: "white",
          border: "none",
        }}
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        padding: isMobile ? "16px 16px 8px" : "28px 24px 10px",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          display: "flex",
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
            gap: 8,
          }}
        >
          {isMobile && hamburger && (
            <button
              onClick={onHamburgerClick}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#0f172a",
                padding: "4px",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              ☰
            </button>
          )}
          <Link
            to={brandLink || "/"}
            style={{
              fontWeight: 800,
              fontSize: isMobile ? 20 : 24,
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
            gap: 4,
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            WebkitOverflowScrolling: "touch",
            marginTop: 12,
            paddingBottom: 6,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {sidebarNav.map((item) => (
            <Link key={item.to} to={item.to} style={{ textDecoration: "none", flexShrink: 0 }}>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background:
                    pathname === item.to
                      ? "rgba(37,99,235,0.08)"
                      : "transparent",
                  color: pathname === item.to ? accent : "#64748b",
                  fontWeight: pathname === item.to ? 700 : 600,
                  fontSize: 12,
                  border: `1px solid ${
                    pathname === item.to
                      ? "rgba(37,99,235,0.20)"
                      : "transparent"
                  }`,
                  transition: "all .12s ease",
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
