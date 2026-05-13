import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./adminStyles.css";

const IconDot = ({ active }) => (
  <span
    aria-hidden="true"
    style={{
      width: 10,
      height: 10,
      borderRadius: 3,
      background: active ? "rgba(37,99,235,0.95)" : "rgba(255,255,255,0.18)",
      border: active
        ? "1px solid rgba(255,255,255,0.35)"
        : "1px solid rgba(255,255,255,0.10)",
      boxShadow: active ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
      display: "inline-block",
      flex: "0 0 auto",
    }}
  />
);

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

const NavItem = ({ to, label, isActive }) => {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div className={`adminNavItem ${isActive ? "adminNavItemActive" : ""}`}>
        <span
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <IconDot active={isActive} />
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {label}
          </span>
        </span>
      </div>
    </Link>
  );
};

export default function UserLayout({ pageTitle, pageSubtitle, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = normalizePathname(location.pathname);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const nav = useMemo(
    () => [
      {
        group: "My Library",
        items: [
          { to: "/user-profile", label: "My Profile" },
          { to: "/user-wishlist", label: "My Wishlist" },
          { to: "/user-reading-history", label: "Reading History" },
        ],
      },
    ],
    [],
  );

  const sidebar = (
    <aside className="adminSidebar" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <div className="adminBrand">
          <div className="adminBrandTitle">My Library</div>
          <div
            style={{
              color: "rgba(229,231,235,0.9)",
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            USER
          </div>
        </div>
        <div className="adminDivider" />
        {nav.map((section) => (
          <div key={section.group}>
            <div className="adminSectionLabel">{section.group}</div>
            <div className="adminNavGroup">
              {section.items.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  isActive={pathname === normalizePathname(item.to)}
                />
              ))}
            </div>
            <div className="adminDivider" />
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.10)",
          padding: "14px 0 4px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            color: "rgba(229,231,235,0.5)",
            fontSize: 11,
            fontWeight: 700,
            padding: "0 6px 4px",
            textTransform: "uppercase",
          }}
        >
          Session
        </div>
        <button
          style={{
            width: "100%",
            textAlign: "left",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(229,231,235,0.92)",
            borderRadius: 12,
            padding: "10px 12px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            transition: "background .12s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
        <button
          style={{
            width: "100%",
            textAlign: "left",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(229,231,235,0.92)",
            borderRadius: 12,
            padding: "10px 12px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            transition: "background .12s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="adminRoot">
      <div className="adminShell">
        {sidebar}
        <div className="adminMain">
          <div className="adminTopbar">
            <div className="adminTopbarLeft">
              <div className="adminPageTitle">{pageTitle}</div>
              {pageSubtitle ? (
                <div className="adminPageSubtitle">{pageSubtitle}</div>
              ) : null}
            </div>
            <div
              style={{ color: "var(--muted)", fontWeight: 600, fontSize: 14 }}
            >
              {user?.emri || "User"}
            </div>
          </div>
          <div className="adminContent">{children}</div>
        </div>
      </div>
    </div>
  );
}
