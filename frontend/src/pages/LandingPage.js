import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const accent = "#2563eb";
  const surface = "#ffffff";
  const border = "rgba(15,23,42,0.10)";
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();
  const action = location.state?.action;
  const displayName = user?.emri || user?.username || "there";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 860);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const greeting = user
    ? action === "signup"
      ? `Welcome, ${displayName}!`
      : `Welcome back, ${displayName}!`
    : null;

  const description = user
    ? user.roli === "admin"
      ? "Your admin panel is ready. Manage books, users and subscriptions from one place."
      : "Your personal library is ready. Track your reading, wishlist and progress from here."
    : "Sign up or login to access your personal library and reading dashboard.";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

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

  const headerActions = user ? (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: isMobile ? "flex-start" : "flex-end",
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
            background: accent,
            color: "white",
            fontWeight: 700,
            textDecoration: "none",
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
        justifyContent: isMobile ? "flex-start" : "flex-end",
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
      style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}
    >
      <div
        style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 48px" }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 42,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 24 }}> Fletëza</div>
          {headerActions}
        </header>

        <section
          style={{
            display: "grid",
            gap: 34,
            alignItems: "center",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 380px",
          }}
        >
          <div>
            {greeting ? (
              <div
                style={{
                  display: "inline-flex",
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "rgba(37, 99, 235, 0.15)",
                  color: accent,
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 24,
                }}
              >
                {greeting}
              </div>
            ) : null}
            <h1
              style={{
                fontSize: "3.4rem",
                lineHeight: 1.03,
                margin: 0,
                letterSpacing: "-0.04em",
                maxWidth: 620,
              }}
            >
              The digital library that powers your learning.
            </h1>
            <p
              style={{
                marginTop: 24,
                maxWidth: 560,
                lineHeight: 1.8,
                color: "#475569",
                fontSize: "1rem",
              }}
            >
              {description}
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 30,
              }}
            >
              {!user ? (
                <>
                  <Link
                    to="/register"
                    style={{
                      padding: "14px 26px",
                      borderRadius: 12,
                      background: accent,
                      color: "white",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Start Reading
                  </Link>
                  <Link
                    to="/login"
                    style={{
                      padding: "14px 26px",
                      borderRadius: 12,
                      background: "transparent",
                      color: "#0f172a",
                      border: `1px solid ${border}`,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Explore the app
                  </Link>
                </>
              ) : user.roli === "admin" ? (
                <Link
                  to="/admin"
                  style={{
                    padding: "14px 26px",
                    borderRadius: 12,
                    background: accent,
                    color: "white",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Go to Admin Panel
                </Link>
              ) : (
                <Link
                  to="/user-profile"
                  style={{
                    padding: "14px 26px",
                    borderRadius: 12,
                    background: accent,
                    color: "white",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Go to My Profile
                </Link>
              )}
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 24,
              background: surface,
              border: `1px solid ${border}`,
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div style={{ display: "grid", gap: 16 }}>
              <div
                style={{
                  width: "100%",
                  height: 260,
                  borderRadius: 20,
                  background:
                    "linear-gradient(180deg, rgba(37,99,235,0.14), rgba(37,99,235,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accent,
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  textAlign: "center",
                  padding: 24,
                }}
              >
                Your personal reading dashboard, ready on login.
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 18,
                    borderRadius: 18,
                    background: "#f8fafc",
                    border: `1px solid ${border}`,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      Search fast
                    </div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>
                      Find books by title, author, or subject.
                    </div>
                  </div>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: accent,
                      display: "grid",
                      placeItems: "center",
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    🔍
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 18,
                    borderRadius: 18,
                    background: "#f8fafc",
                    border: `1px solid ${border}`,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      Build your lists
                    </div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>
                      Collect saved books, wishlist items, and reading progress.
                    </div>
                  </div>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: accent,
                      display: "grid",
                      placeItems: "center",
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    ➕
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 18,
                    borderRadius: 18,
                    background: "#f8fafc",
                    border: `1px solid ${border}`,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      Track progress
                    </div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>
                      See your reading history and current books in one place.
                    </div>
                  </div>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: accent,
                      display: "grid",
                      placeItems: "center",
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    📚
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 48 }}>
          <div
            style={{
              display: "grid",
              gap: 18,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {[
              {
                title: "Designed for students",
                description:
                  "A clean interface that keeps your reading goals and resources in one place.",
              },
              {
                title: "Easy account flow",
                description:
                  "Quick signup and login with a profile that stays private and personal.",
              },
              {
                title: "Library-first experience",
                description:
                  "A polished landing page and dashboard designed around your reading journey.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                style={{
                  padding: 24,
                  borderRadius: 18,
                  background: surface,
                  border: `1px solid ${border}`,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 10 }}>
                  {feature.title}
                </div>
                <div style={{ color: "#64748b", lineHeight: 1.7 }}>
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
