import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const accent = "#2563eb";
const borderColor = "rgba(15,23,42,0.10)";

const NavItem = ({ to, label, isActive }) => {
  const [hover, setHover] = useState(false);
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: isActive
            ? "rgba(37,99,235,0.08)"
            : hover
              ? "#f1f5f9"
              : "transparent",
          color: isActive ? accent : "#334155",
          fontWeight: isActive ? 700 : 600,
          fontSize: 14,
          border: `1px solid ${isActive ? "rgba(37,99,235,0.20)" : "transparent"}`,
          transition: "all .12s ease",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {label}
      </div>
    </Link>
  );
};

export default function Sidebar({ open, pathname }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 980);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const nav = [
    {
      group: "My Library",
      items: [
        { to: "/user-profile", label: "My Profile" },
        { to: "/user-wishlist", label: "My Wishlist" },
        { to: "/user-reading-history", label: "Reading History" },
        { to: "/user-collections", label: "Collections" },
        { to: "/user-bookmarks", label: "Bookmarks" },
        { to: "/user-book-requests", label: "Book Requests" },
      ],
    },
  ];

  const sidebarContent = (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        padding: "6px 14px",
        whiteSpace: "nowrap",
      }}
    >
      {nav.map((section) => (
        <div key={section.group}>
          <div
            style={{
              color: "#94a3b8",
              fontSize: 11,
              fontWeight: 700,
              padding: "12px 4px 8px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {section.group}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {section.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                isActive={pathname === item.to}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const sessionButtons = (
    <div
      style={{
        borderTop: `1px solid ${borderColor}`,
        padding: "10px 14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: 11,
          fontWeight: 700,
          padding: "0 4px 4px",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Session
      </div>
      <button
        style={{
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: `1px solid ${borderColor}`,
          color: "#334155",
          borderRadius: 10,
          padding: "10px 12px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 13,
          transition: "all .12s ease",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f8fafc";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>
      <button
        style={{
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: `1px solid ${borderColor}`,
          color: "#334155",
          borderRadius: 10,
          padding: "10px 12px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 13,
          transition: "all .12s ease",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f8fafc";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );

  /* Mobile: hide sidebar (header nav is enough) */
  if (isMobile) return null;

  /* Desktop: inline sidebar with width transition */
  return (
    <aside
      style={{
        width: open ? 260 : 0,
        minWidth: open ? 260 : 0,
        overflow: "hidden",
        background: "#fff",
        borderRight: open ? `1px solid ${borderColor}` : "none",
        display: "flex",
        flexDirection: "column",
        borderRadius: 14,
        boxShadow: open
          ? "4px 0 24px rgba(15,23,42,0.06)"
          : "none",
        transition:
          "width .2s ease, min-width .2s ease, border-right .2s ease, box-shadow .2s ease",
        alignSelf: "stretch",
      }}
    >
      <div
        style={{
          opacity: open ? 1 : 0,
          transition: "opacity .15s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
        }}
      >
        {sidebarContent}
        {sessionButtons}
      </div>
    </aside>
  );
}
