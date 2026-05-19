import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import UserLayout from "../admin/UserLayout";

const borderColor = "rgba(15,23,42,0.10)";

function DetailContent({ book, navigate }) {
  return (
    <>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 16px", borderRadius: 10, border: "none",
          background: "#f1f5f9", color: "#334155", fontWeight: 700, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6,
          marginBottom: 28,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </button>

      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          {book.foto_kopertines ? (
            <div style={{
              width: 240, height: 350, flexShrink: 0, borderRadius: 14, overflow: "hidden",
              background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(15,23,42,0.10)",
            }}>
              <img src={book.foto_kopertines} alt={book.titulli} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div style={{
              width: 240, height: 350, flexShrink: 0, borderRadius: 14,
              background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#94a3b8", fontWeight: 700, fontSize: 14,
            }}>No Cover</div>
          )}

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6, padding: "0 4px" }}>
            {book.viti_botimit && (
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#64748b", minWidth: 80 }}>Published</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{book.viti_botimit}</span>
              </div>
            )}
            {book.gjuha && (
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#64748b", minWidth: 80 }}>Language</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{book.gjuha}</span>
              </div>
            )}
            {book.numri_faqeve && (
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#64748b", minWidth: 80 }}>Pages</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{book.numri_faqeve}</span>
              </div>
            )}
            {book.isbn && (
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#64748b", minWidth: 80 }}>ISBN</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{book.isbn}</span>
              </div>
            )}
            {book.formati && (
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#64748b", minWidth: 80 }}>Format</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{book.formati}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260, maxWidth: 640 }}>
          <div style={{ fontWeight: 900, fontSize: 30, lineHeight: 1.15, color: "#0f172a", marginBottom: 2 }}>{book.titulli}</div>
          {book.autor_emri && (
            <div style={{ fontSize: 15, color: "#64748b", fontWeight: 600, marginBottom: 12 }}>
              by {book.autor_emri} {book.autor_mbiemri}
            </div>
          )}
          {book.pdf_link && (
            <a
              href={book.pdf_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "inline-block", marginBottom: 24 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#2563eb",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.30)",
                  transition: "transform .12s ease, box-shadow .12s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(37,99,235,0.40)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.30)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                Read
              </div>
            </a>
          )}
          {book.description && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>About this book</div>
              <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.8 }}>{book.description}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/books/${id}`)
      .then((res) => { if (!res.ok) throw new Error("Not found"); return res.json(); })
      .then((data) => { setBook(data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  if (loading) {
    const msg = <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748b", fontWeight: 600 }}>Loading...</div>;
    return user ? <UserLayout pageTitle="Book Details" pageSubtitle="">{msg}</UserLayout> : <div style={{ minHeight: "100vh", background: "#f8fafc" }}><Header />{msg}</div>;
  }

  if (!book) {
    const msg = (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Book not found</div>
        <Link to="/browse" style={{ color: "#2563eb", fontWeight: 600, fontSize: 14 }}>Back to browse</Link>
      </div>
    );
    return user ? <UserLayout pageTitle="Book Details" pageSubtitle="">{msg}</UserLayout> : <div style={{ minHeight: "100vh", background: "#f8fafc" }}><Header />{msg}</div>;
  }

  if (user) {
    return (
      <UserLayout pageTitle="Book Details" pageSubtitle="">
        <DetailContent book={book} navigate={navigate} />
      </UserLayout>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
      <Header />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" }}>
        <DetailContent book={book} navigate={navigate} />
      </div>
    </div>
  );
}
