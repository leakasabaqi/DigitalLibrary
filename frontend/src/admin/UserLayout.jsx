import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./adminStyles.css";

const borderColor = "rgba(15,23,42,0.10)";

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

const NavItem = ({ to, label, isActive }) => {
  const accent = "#2563eb";
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: isActive ? "rgba(37,99,235,0.08)" : "transparent",
          color: isActive ? accent : "#334155",
          fontWeight: isActive ? 700 : 600,
          fontSize: 14,
          border: `1px solid ${isActive ? "rgba(37,99,235,0.20)" : "transparent"}`,
          transition: "all .12s ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = "#f1f5f9";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = "transparent";
        }}
      >
        {label}
      </div>
    </Link>
  );
};

export default function UserLayout({ pageTitle, pageSubtitle, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = normalizePathname(location.pathname);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sidebarNav = [
    { to: "/user-profile", label: "My Profile" },
    { to: "/user-wishlist", label: "My Wishlist" },
    { to: "/user-reading-history", label: "Reading History" },
    { to: "/user-collections", label: "Collections" },
    { to: "/user-bookmarks", label: "Bookmarks" },
    { to: "/user-book-requests", label: "Book Requests" },
  ];

  const nav = useMemo(
    () => [
      {
        group: "My Library",
        items: sidebarNav,
      },
    ],
    [sidebarNav],
  );

  const sidebar = (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        background: "#fff",
        borderRight: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        alignSelf: "start",
        boxShadow: "4px 0 24px rgba(15,23,42,0.06)",
        zIndex: 2,
      }}
    >
      <div style={{ flex: 1, minHeight: 0, padding: "20px 14px" }}>
        <div style={{ height: 14 }} />

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
                  isActive={pathname === normalizePathname(item.to)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: `1px solid ${borderColor}`,
          padding: "14px 14px 20px",
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
          Back to Home
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
    </aside>
  );

  return (
    <div className="adminRoot">
      <Header showSidebar sidebarNav={sidebarNav} pathname={pathname} />
      <div style={!isMobile ? { paddingTop: 24 } : {}}>
        <div className={isMobile ? "" : "adminShell"}>
        {!isMobile && sidebar}
        <div className="adminMain">
          <div className="adminTopbar">
            <div className="adminTopbarLeft">
              <div className="adminPageTitle">{pageTitle}</div>
              {pageSubtitle ? (
                <div className="adminPageSubtitle">{pageSubtitle}</div>
              ) : null}
            </div>
            {!isMobile && (
              <div
                style={{ color: "var(--muted)", fontWeight: 600, fontSize: 14 }}
              >
                {user?.emri || "User"}
              </div>
            )}
          </div>
          <div className="adminContent">{children}</div>
        </div>
      </div>
      </div>
    </div>
  );
}
