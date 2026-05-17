import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";

function Counter({ end, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const step = Math.ceil(end / 30);
          const iv = setInterval(() => {
            start += step;
            if (start >= end) {
              setVal(end);
              clearInterval(iv);
            } else {
              setVal(start);
            }
          }, 40);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity .6s ease, transform .6s ease",
      }}
    >
      {children}
    </div>
  );
}

function FloatingShape({ top, left, size, color, delay }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity: 0.15,
        pointerEvents: "none",
        animation: `float ${6 + Math.random() * 4}s ease-in-out ${delay}s infinite`,
        filter: "blur(2px)",
      }}
    />
  );
}

export default function LandingPage() {
  const accent = "#2563eb";
  const border = "rgba(15,23,42,0.10)";
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const action = location.state?.action;
  const displayName = user?.emri || user?.username || "there";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 980);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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

  const features = [
    {
      icon: "🔍",
      title: "Search fast",
      desc: "Find books by title, author, or subject in seconds.",
    },
    {
      icon: "📋",
      title: "Build your lists",
      desc: "Collect saved books, wishlist items, and reading progress.",
    },
    {
      icon: "📊",
      title: "Track progress",
      desc: "See your reading history and current books in one place.",
    },
  ];

  const highlights = [
    { number: 500, suffix: "+", label: "Books" },
    { number: 50, suffix: "+", label: "Categories" },
    { number: 1000, suffix: "+", label: "Active Readers" },
    { number: 95, suffix: "%", label: "Satisfaction" },
  ];

  const extraFeatures = [
    {
      icon: "🎯",
      title: "Personalized Dashboard",
      desc: "Your reading history, wishlist, and current books all in one view.",
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      desc: "Read and track progress from any device — desktop, tablet, or phone.",
    },
    {
      icon: "🏷️",
      title: "Smart Categorization",
      desc: "Books organized by category and subcategory for easy discovery.",
    },
    {
      icon: "⚡",
      title: "Real-time Progress",
      desc: "Update your current page and see reading percentage instantly.",
    },
  ];

  return (
    <div
      style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(4deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Header />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 48px" }}>
        {/* Hero */}
        <FadeIn>
          <section
            style={{
              display: "grid",
              gap: 34,
              alignItems: "center",
              marginTop: 42,
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 380px",
              position: "relative",
            }}
          >
            <FloatingShape
              top="-20px"
              left="-40px"
              size="120px"
              color={accent}
              delay={0}
            />
            <FloatingShape
              top="60%"
              left="60%"
              size="80px"
              color="#16a34a"
              delay={1.5}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
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
                    animation: "pulse 2.5s ease-in-out infinite",
                  }}
                >
                  {greeting}
                </div>
              ) : null}
              <h1
                style={{
                  fontSize: isMobile ? "2.6rem" : "3.4rem",
                  lineHeight: 1.03,
                  margin: 0,
                  letterSpacing: "-0.04em",
                  maxWidth: 620,
                }}
              >
                The digital library that{" "}
                <span
                  style={{
                    color: accent,
                    background:
                      "linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmer 3s ease-in-out infinite",
                  }}
                >
                  powers
                </span>{" "}
                your learning.
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
                        transition: "transform .12s ease, box-shadow .12s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 8px 24px rgba(37,99,235,0.30)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
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
                        transition: "background .12s ease, transform .12s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#f1f5f9";
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.transform = "translateY(0)";
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
                      transition: "transform .12s ease, box-shadow .12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 8px 24px rgba(37,99,235,0.30)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
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
                      transition: "transform .12s ease, box-shadow .12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 8px 24px rgba(37,99,235,0.30)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
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
                background: "#fff",
                border: `1px solid ${border}`,
                boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <FloatingShape
                top="50%"
                left="-20px"
                size="60px"
                color="#f59e0b"
                delay={0.8}
              />
              <div
                style={{
                  width: "100%",
                  height: 260,
                  borderRadius: 20,
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.08))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: accent,
                  fontWeight: 800,
                  fontSize: isMobile ? "1.1rem" : "1.35rem",
                  textAlign: "center",
                  padding: 24,
                  marginBottom: 16,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: 12,
                    animation: "float 3.5s ease-in-out infinite",
                  }}
                >
                  📖
                </div>
                <div>Your personal reading dashboard</div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    marginTop: 6,
                    color: "#64748b",
                  }}
                >
                  ready on login.
                </div>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {features.map((f, i) => (
                  <div
                    key={f.title}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 16,
                      borderRadius: 16,
                      background: "#f8fafc",
                      border: `1px solid ${border}`,
                      transition: "transform .12s ease, box-shadow .12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(4px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(37,99,235,0.10)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          marginBottom: 2,
                          fontSize: 14,
                        }}
                      >
                        {f.title}
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>
                        {f.desc}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: accent,
                        display: "grid",
                        placeItems: "center",
                        color: "white",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {f.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={150}>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? "120px" : "160px"}, 1fr))`,
              gap: 14,
              marginTop: 60,
            }}
          >
            {highlights.map((h) => (
              <div
                key={h.label}
                style={{
                  padding: isMobile ? "20px 12px" : "28px 20px",
                  borderRadius: 18,
                  background: "#fff",
                  border: `1px solid ${border}`,
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(15,23,42,0.04)",
                  transition: "transform .15s ease, box-shadow .15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(15,23,42,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(15,23,42,0.04)";
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "1.6rem" : "2rem",
                    fontWeight: 900,
                    color: accent,
                    letterSpacing: "-0.03em",
                    marginBottom: 4,
                  }}
                >
                  <Counter end={h.number} suffix={h.suffix} />
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontWeight: 600,
                    fontSize: isMobile ? 12 : 14,
                  }}
                >
                  {h.label}
                </div>
              </div>
            ))}
          </section>
        </FadeIn>

        {/* Features Grid */}
        <FadeIn delay={300}>
          <section style={{ marginTop: 60 }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2
                style={{
                  fontSize: isMobile ? "1.5rem" : "1.8rem",
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: "-0.03em",
                }}
              >
                Everything you need to{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  read better
                </span>
              </h2>
              <p
                style={{
                  color: "#64748b",
                  marginTop: 10,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Tools designed to make your reading journey organized and
                enjoyable.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? "240px" : "260px"}, 1fr))`,
                gap: 18,
              }}
            >
              {extraFeatures.map((f, i) => (
                <div
                  key={f.title}
                  style={{
                    padding: 28,
                    borderRadius: 20,
                    background: "#fff",
                    border: `1px solid ${border}`,
                    boxShadow: "0 8px 30px rgba(15,23,42,0.04)",
                    transition: "transform .2s ease, box-shadow .2s ease",
                    cursor: "default",
                    opacity: 0,
                    animation: `fadeInUp 0.5s ease ${0.1 + i * 0.1}s forwards`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 50px rgba(15,23,42,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 30px rgba(15,23,42,0.04)";
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background:
                        "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.08))",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 24,
                      marginBottom: 18,
                      transition: "transform .2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1.1) rotate(-4deg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1) rotate(0)";
                    }}
                  >
                    {f.icon}
                  </div>
                  <div
                    style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}
                  >
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* CTA */}
        {!user && (
          <FadeIn delay={450}>
            <section
              style={{
                marginTop: 60,
                padding: isMobile ? "36px 24px" : "52px 40px",
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.04))",
                border: `1px solid rgba(37,99,235,0.15)`,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <FloatingShape
                top="-30px"
                right="-20px"
                size="100px"
                color="#7c3aed"
                delay={0.3}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2
                  style={{
                    fontSize: isMobile ? "1.4rem" : "1.8rem",
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Ready to start your reading journey?
                </h2>
                <p
                  style={{
                    color: "#475569",
                    marginTop: 12,
                    maxWidth: 480,
                    marginLeft: "auto",
                    marginRight: "auto",
                    lineHeight: 1.7,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Join our community of readers. Track your progress, discover
                  new books, and never lose your place again.
                </p>
                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    to="/register"
                    style={{
                      padding: "14px 28px",
                      borderRadius: 12,
                      background: accent,
                      color: "white",
                      fontWeight: 700,
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "transform .12s ease, box-shadow .12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 8px 24px rgba(37,99,235,0.30)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/login"
                    style={{
                      padding: "14px 28px",
                      borderRadius: 12,
                      background: "transparent",
                      color: "#0f172a",
                      border: `1px solid ${border}`,
                      fontWeight: 700,
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "background .12s ease, transform .12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#f1f5f9";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </section>
          </FadeIn>
        )}
      </div>

      {/* Footer */}
      <FadeIn>
        <footer
          style={{
            borderTop: `1px solid ${border}`,
            background: "#fff",
            padding: isMobile ? "32px 24px 24px" : "48px 24px 32px",
          }}
        >
          <div
            style={{
              maxWidth: 1240,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: "#0f172a",
                marginBottom: 8,
              }}
            >
              Fletëza
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: 13,
                lineHeight: 1.7,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              The digital library that powers your learning. Track, discover,
              and manage your reading journey all in one place.
            </div>
          </div>
          <div
            style={{
              maxWidth: 1240,
              margin: "0 auto",
              marginTop: isMobile ? 20 : 28,
              paddingTop: isMobile ? 16 : 24,
              borderTop: `1px solid ${border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>
              &copy; {new Date().getFullYear()} Fletëza. Brought to life by
              Valëza, Lea, Nol, and Jon.
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <span
                  key={item}
                  style={{
                    color: "#94a3b8",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "color .12s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#94a3b8")
                  }
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </FadeIn>

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={scrollTop}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: accent,
            color: "white",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(37,99,235,0.30)",
            zIndex: 50,
            transition: "transform .15s ease, box-shadow .15s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 8px 24px rgba(37,99,235,0.40)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 16px rgba(37,99,235,0.30)";
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}
