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

const NavSubItem = ({ to, label, isActive }) => {
  const accent = "#2563eb";
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        style={{
          padding: "9px 14px",
          borderRadius: 8,
          background: isActive ? "rgba(37,99,235,0.08)" : "transparent",
          color: isActive ? accent : "#475569",
          fontWeight: isActive ? 700 : 600,
          fontSize: 13,
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

export default function AdminLayout({ pageTitle, pageSubtitle, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = normalizePathname(location.pathname);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 980);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const nav = useMemo(
    () => [
      {
        group: "Core",
        items: [
          { to: "/admin", label: "Books" },
          { to: "/authors", label: "Authors" },
          { to: "/categories", label: "Categories" },
          { to: "/users", label: "Users" },
        ],
      },
      {
        group: "Publishing",
        items: [
          { to: "/plans", label: "Plans" },
          { to: "/subscriptions", label: "Subscriptions" },
          { to: "/history", label: "History" },
          { to: "/reviews", label: "Reviews" },
          { to: "/wishlist", label: "Wishlists" },
        ],
      },
      {
        group: "Collections",
        items: [
          { to: "/collections", label: "Collections" },
          { to: "/collectionbooks", label: "Collection Books" },
        ],
      },
      {
        group: "Requests",
        items: [
          { to: "/bookmarks", label: "Bookmarks" },
          { to: "/requests", label: "Requests" },
        ],
      },
    ],
    [],
  );

  const flatNav = useMemo(
    () => nav.flatMap((s) => s.items),
    [nav],
  );

  const [openGroups, setOpenGroups] = useState(() => ({
    "Collections:Collection": true,
  }));

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sidebarContent = (
    <>
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
              {section.items.map((item) => {
                if (item.type === "group") {
                  const key = `${section.group}:${item.label}`;
                  const isOpen = openGroups[key] ?? false;
                  return (
                    <div key={item.label}>
                      <button
                        type="button"
                        onClick={() => toggleGroup(key)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "transparent",
                          border: "none",
                          borderRadius: 10,
                          padding: "10px 14px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#334155",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          fontFamily: "inherit",
                          transition: "background .12s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                        aria-expanded={isOpen}
                      >
                        <span>{item.label}</span>
                        <span
                          aria-hidden="true"
                          style={{
                            fontWeight: 900,
                            color: "#94a3b8",
                            paddingLeft: 10,
                          }}
                        >
                          {isOpen ? "\u2212" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            paddingLeft: 8,
                            marginTop: 6,
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          {item.children.map((c) => (
                            <NavSubItem
                              key={c.to}
                              to={c.to}
                              label={c.label}
                              isActive={pathname === normalizePathname(c.to)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    isActive={pathname === normalizePathname(item.to)}
                  />
                );
              })}
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
            background: "rgba(37, 99, 235, 0.10)",
            border: "1px solid rgba(37, 99, 235, 0.25)",
            color: "#2563eb",
            borderRadius: 10,
            padding: "10px 12px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            transition: "all .12s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(37, 99, 235, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(37, 99, 235, 0.10)";
          }}
          onClick={() => navigate("/")}
        >
          View Storefront
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
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </>
  );

  const desktopSidebar = (
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
      {sidebarContent}
    </aside>
  );

  return (
    <div className="adminRoot">
      <Header showSidebar={isMobile} sidebarNav={flatNav} pathname={pathname} />
      <div className={isMobile ? "" : "adminShell"}>
        {!isMobile && desktopSidebar}
        <div className="adminMain">
          <div className="adminTopbar">
            <div className="adminTopbarLeft">
              <div className="adminPageTitle">{pageTitle}</div>
              {pageSubtitle ? (
                <div className="adminPageSubtitle">{pageSubtitle}</div>
              ) : null}
            </div>
            <div style={{ color: "var(--muted)", fontWeight: 600, fontSize: 14 }}>
              {JSON.parse(localStorage.getItem("user"))?.emri || "Admin User"}
            </div>
          </div>
          <div className="adminContent">{children}</div>
        </div>
      </div>
    </div>
  );
}
