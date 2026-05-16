import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";

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
          if (!isActive) {
            e.currentTarget.style.background = "#f1f5f9";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {label}
      </div>
    </Link>
  );
};

function Sidebar({ pathname }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const nav = useMemo(
    () => [
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
    ],
    [],
  );

  if (isMobile) return null;

  return (
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
}

function CategoryGrid() {
  const accent = "#2563eb";
  const surface = "#ffffff";
  const border = "rgba(15,23,42,0.10)";
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const mainCategories = categories.filter((c) => !c.kategoria_prind_id);
  const subCategories = categories.filter((c) => c.kategoria_prind_id);
  const getSubcategories = (parentId) =>
    subCategories.filter((c) => c.kategoria_prind_id === parentId);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#64748b",
          fontWeight: 600,
        }}
      >
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#64748b",
          fontWeight: 600,
        }}
      >
        No categories available yet.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 18,
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      }}
    >
      {mainCategories.map((cat) => {
        const subs = getSubcategories(cat.id);
        return (
          <div
            key={cat.id}
            style={{
              padding: 24,
              borderRadius: 18,
              background: surface,
              border: `1px solid ${border}`,
              boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
              transition: "transform .15s ease, box-shadow .15s ease",
              cursor: "default",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 16px 48px rgba(15, 23, 42, 0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(15, 23, 42, 0.06)";
            }}
          >
            {cat.ikona && (
              <img
                src={cat.ikona}
                alt={cat.emertimi}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  objectFit: "cover",
                  marginBottom: 14,
                }}
              />
            )}
            <div
              style={{
                fontWeight: 800,
                fontSize: 16,
                marginBottom: 6,
              }}
            >
              {cat.emertimi}
            </div>
            {cat.pershkrimi && (
              <div
                style={{
                  color: "#64748b",
                  fontSize: 13,
                  lineHeight: 1.6,
                  marginBottom: 12,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {cat.pershkrimi}
              </div>
            )}
            {subs.length > 0 && (
              <div style={{ marginTop: "auto" }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    marginBottom: 8,
                  }}
                >
                  Subcategories
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {subs.map((sub) => (
                    <span
                      key={sub.id}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background: "rgba(37, 99, 235, 0.08)",
                        color: accent,
                      }}
                    >
                      {sub.emertimi}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PublicBrowse() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <Header />
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 24px 48px",
        }}
      >
        <div style={{ marginTop: 42, marginBottom: 32 }}>
          <h1
            style={{
              fontSize: isMobile ? "1.8rem" : "2.4rem",
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Browse Books by Category
          </h1>
          <p
            style={{
              marginTop: 10,
              color: "#475569",
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            Explore our collection of books organized by category. Pick a
            category to discover your next read.
          </p>
        </div>

        <CategoryGrid />
      </div>
    </div>
  );
}

function LoggedInBrowse() {
  const location = useLocation();
  const pathname = normalizePathname(location.pathname);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const sidebarNav = [
    { to: "/user-profile", label: "My Profile" },
    { to: "/user-wishlist", label: "My Wishlist" },
    { to: "/user-reading-history", label: "Reading History" },
    { to: "/user-collections", label: "Collections" },
    { to: "/user-bookmarks", label: "Bookmarks" },
    { to: "/user-book-requests", label: "Book Requests" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb" }}>
      <Header showSidebar sidebarNav={sidebarNav} pathname={pathname} />
      <div style={{ display: "flex", minHeight: "100vh", paddingTop: 24 }}>
        <Sidebar pathname={pathname} />
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: isMobile ? "0 16px 40px" : "0 28px 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: 14,
              marginBottom: 24,
              marginTop: isMobile ? 20 : 0,
            }}
          >
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "baseline", gap: 6 }}>
              <div style={{ fontSize: isMobile ? 20 : 18, fontWeight: 800 }}>
                Browse Books
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                Explore categories and discover books
              </div>
            </div>
            <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>
              {user?.emri || "User"}
            </div>
          </div>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <CategoryGrid />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowseBooks() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return <LoggedInBrowse />;
  }

  return <PublicBrowse />;
}
