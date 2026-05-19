import { Link, useLocation, useNavigate, createSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import Header from "../components/Header";

const borderColor = "rgba(15,23,42,0.10)";

function SearchBar({ onSearch, searching }) {
  const [query, setQuery] = useState("");
  const timer = useRef(null);
  const cb = useRef(onSearch);
  cb.current = onSearch;

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      cb.current(query);
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query]);

  return (
    <div
      style={{
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#fff",
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: "8px 16px",
        boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
        transition: "border-color .15s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563eb"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by book title or author"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: 14,
          fontWeight: 600,
          color: "#0f172a",
          background: "transparent",
          fontFamily: "inherit",
        }}
      />
      {query && searching && (
        <span style={{ fontSize: 12, color: "#94a3b8" }}>Searching...</span>
      )}
    </div>
  );
}

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
          { to: "/user-reviews", label: "Reviews" },
          { to: "/user-subscriptions", label: "Subscriptions" },
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

function CategoryGrid({ onSelect, hasSubscription }) {
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
    <div>
      <div
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
      >
        {mainCategories.map((cat) => {
          const subs = getSubcategories(cat.id);
          const isLocked = !!cat.a_eshte_premium && !hasSubscription;
          return (
            <div
              key={cat.id}
              onClick={() => onSelect?.(cat)}
              style={{
                padding: 24,
                borderRadius: 18,
                background: surface,
                border: `1px solid ${border}`,
                boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
                transition: "transform .15s ease, box-shadow .15s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                position: "relative",
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
              {!!isLocked && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(100, 116, 139, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              )}
              {!!cat.ikona && (
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
    </div>
  );
}

function BookResults({ books, loading }) {
  if (loading) {
    return <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b", fontWeight: 600 }}>Searching...</div>;
  }
  if (books.length === 0) {
    return <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b", fontWeight: 600 }}>No books found.</div>;
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
      {books.map((b) => (
        <Link to={`/book/${b.id}`} key={b.id} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{
            background: "#fff", borderRadius: 12, border: `1px solid ${borderColor}`,
            boxShadow: "0 4px 16px rgba(15,23,42,0.06)", overflow: "hidden",
            display: "flex", flexDirection: "column",
            transition: "transform .15s ease, box-shadow .15s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,23,42,0.10)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.06)"; }}
          >
            {b.foto_kopertines ? (
              <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
                <img src={b.foto_kopertines} alt={b.titulli} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
            ) : (
              <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 700, fontSize: 13 }}>No Cover</div>
            )}
            <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{b.titulli}</div>
              {b.autor_emri && <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{b.autor_emri} {b.autor_mbiemri}</div>}
              {b.description && <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.description}</div>}
              {b.isbn && <div style={{ fontSize: 11, color: "#94a3b8" }}>ISBN: {b.isbn}</div>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function PublicBrowse() {
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`http://localhost:5000/books/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCategoryLoading(true);
    fetch(`http://localhost:5000/books/category/${cat.id}`)
      .then((res) => { if (!res.ok) throw new Error("Failed"); return res.json(); })
      .then((data) => {
        setCategoryBooks(Array.isArray(data) ? data : []);
        setCategoryLoading(false);
      })
      .catch((err) => {
        console.error("Category books fetch error:", err);
        setCategoryBooks([]);
        setCategoryLoading(false);
      });
  };

  const content = () => {
    if (searchQuery.trim()) {
      return <BookResults books={searchResults} loading={searching} />;
    }
    if (selectedCategory) {
      return (
        <>
          <div style={{ marginBottom: 24, background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`, padding: 24 }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: "8px 16px", borderRadius: 10, border: "none",
                background: "#f1f5f9", color: "#334155", fontWeight: 700, fontSize: 13,
                cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to categories
            </button>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", marginBottom: 4 }}>{selectedCategory.emertimi}</div>
            {selectedCategory.pershkrimi && (
              <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>{selectedCategory.pershkrimi}</div>
            )}
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{categoryBooks.length} {categoryBooks.length === 1 ? "book" : "books"}</div>
          </div>
          {!!selectedCategory.a_eshte_premium && (
            <div style={{ marginBottom: 24, padding: "14px 20px", borderRadius: 12, background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              This is a premium category — you need an active subscription to read these books.
            </div>
          )}
          <BookResults books={categoryBooks} loading={categoryLoading} />
        </>
      );
    }
    return <CategoryGrid onSelect={handleCategorySelect} hasSubscription={false} />;
  };

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
        width: "100%",
            }}
          >
            Explore our collection of books organized by category. Pick a
            category to discover your next read.
          </p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <SearchBar onSearch={handleSearch} searching={searching} />
        </div>

        {content()}
      </div>
    </div>
  );
}

function LoggedInBrowse() {
  const location = useLocation();
  const pathname = normalizePathname(location.pathname);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/subscriptions/active/${user.id}`)
        .then((res) => res.json())
        .then((data) => setHasSubscription(!!data))
        .catch(() => setHasSubscription(false));
    }
  }, [user?.id]);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`http://localhost:5000/books/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCategoryLoading(true);
    fetch(`http://localhost:5000/books/category/${cat.id}`)
      .then((res) => { if (!res.ok) throw new Error("Failed"); return res.json(); })
      .then((data) => {
        setCategoryBooks(Array.isArray(data) ? data : []);
        setCategoryLoading(false);
      })
      .catch((err) => {
        console.error("Category books fetch error:", err);
        setCategoryBooks([]);
        setCategoryLoading(false);
      });
  };

  const sidebarNav = [
    { to: "/user-profile", label: "My Profile" },
    { to: "/user-wishlist", label: "My Wishlist" },
    { to: "/user-reading-history", label: "Reading History" },
    { to: "/user-collections", label: "Collections" },
    { to: "/user-bookmarks", label: "Bookmarks" },
    { to: "/user-book-requests", label: "Book Requests" },
    { to: "/user-reviews", label: "Reviews" },
    { to: "/user-subscriptions", label: "Subscriptions" },
  ];

  const content = () => {
    if (searchQuery.trim()) {
      return <BookResults books={searchResults} loading={searching} />;
    }
    if (selectedCategory) {
      return (
        <>
          <div style={{ marginBottom: 24, background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`, padding: 24 }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: "8px 16px", borderRadius: 10, border: "none",
                background: "#f1f5f9", color: "#334155", fontWeight: 700, fontSize: 13,
                cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to categories
            </button>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", marginBottom: 4 }}>{selectedCategory.emertimi}</div>
            {selectedCategory.pershkrimi && (
              <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>{selectedCategory.pershkrimi}</div>
            )}
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{categoryBooks.length} {categoryBooks.length === 1 ? "book" : "books"}</div>
          </div>
          {!!selectedCategory.a_eshte_premium && !hasSubscription && (
            <div style={{ marginBottom: 24, padding: "14px 20px", borderRadius: 12, background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              This is a premium category — you need an active subscription to read these books.
            </div>
          )}
          <BookResults books={categoryBooks} loading={categoryLoading} />
        </>
      );
    }
    return <CategoryGrid onSelect={handleCategorySelect} hasSubscription={hasSubscription} />;
  };

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

          <div style={{ marginBottom: 28 }}>
            <SearchBar onSearch={handleSearch} searching={searching} />
          </div>

          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {content()}
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
