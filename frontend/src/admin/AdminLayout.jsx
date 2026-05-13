import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const NavSubItem = ({ to, label, isActive }) => {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        className={`adminNavSubItem ${isActive ? "adminNavSubItemActive" : ""}`}
      >
        <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: isActive
                ? "rgba(37,99,235,0.95)"
                : "rgba(255,255,255,0.20)",
              border: "1px solid rgba(255,255,255,0.12)",
              flex: "0 0 auto",
            }}
          />
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

export default function AdminLayout({ pageTitle, pageSubtitle, children }) {
  const location = useLocation();
  const pathname = normalizePathname(location.pathname);

  // Categories: Collections + Collection Books grouped, etc.
  // Keep labels professional, no emoji.
  const nav = useMemo(
    () => [
      {
        group: "Core",
        items: [
          { to: "/admin-dashboard", label: "Books" },
          { to: "/authors", label: "Authors" },
          { to: "/categories", label: "Categories" },
          { to: "/users", label: "Users" },
        ],
      },
      {
        group: "Publishing",
        items: [
          { to: "/plans", label: "Subscription Plans" },
          { to: "/subscriptions", label: "Subscriptions" },
          { to: "/history", label: "Reading History" },
          { to: "/reviews", label: "Reviews" },
          { to: "/wishlist", label: "Wishlists" },
        ],
      },
      {
        group: "Collections",
        // Sub-items example requested: Collection + Collection Books in same category
        items: [
          {
            type: "group",
            label: "Collection",
            children: [
              { to: "/collections", label: "Collections" },
              { to: "/collectionbooks", label: "Collection Books" },
            ],
          },
        ],
      },
      {
        group: "Requests",
        items: [
          { to: "/bookmarks", label: "Bookmarks" },
          { to: "/requests", label: "Book Requests" },
        ],
      },
    ],
    [],
  );

  const [openGroups, setOpenGroups] = useState(() => ({
    "Collections:Collection": true,
  }));

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sidebar = (
    <aside className="adminSidebar">
      <div className="adminBrand">
        <div className="adminBrandTitle">Digital Library Admin</div>
        <div
          style={{
            color: "rgba(229,231,235,0.9)",
            fontWeight: 900,
            fontSize: 12,
          }}
        >
          ADMIN
        </div>
      </div>
      <div className="adminDivider" />
      {nav.map((section) => (
        <div key={section.group}>
          <div className="adminSectionLabel">{section.group}</div>
          <div className="adminNavGroup">
            {section.items.map((item) => {
              if (item.type === "group") {
                const key = `${section.group}:${item.label}`;
                const isOpen = openGroups[key] ?? false;
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(key)}
                      className="adminNavItem"
                      style={{ width: "100%", background: "transparent" }}
                      aria-expanded={isOpen}
                    >
                      <span
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <IconDot active={false} />
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.label}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        style={{
                          fontWeight: 900,
                          color: "rgba(229,231,235,0.75)",
                          paddingLeft: 10,
                        }}
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="adminNavSub" style={{ marginTop: 8 }}>
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
          <div className="adminDivider" />
        </div>
      ))}
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{ color: "var(--muted)", fontWeight: 600, fontSize: 14 }}
              >
                Logged in as:{" "}
                {JSON.parse(localStorage.getItem("user"))?.emri || "Admin User"}
              </div>
              <button
                style={{
                  padding: "8px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface)",
                  color: "var(--text)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="adminContent">{children}</div>
        </div>
      </div>
    </div>
  );
}
