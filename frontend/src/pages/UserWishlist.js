import { useState, useEffect } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";

const borderColor = "rgba(15,23,42,0.10)";

export default function UserWishlist() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [wishlist, setWishlist] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 980);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      axios.get(`http://localhost:5000/wishlists?perdoruesi_id=${user.id}`),
      axios.get("http://localhost:5000/books"),
    ])
      .then(([resW, resB]) => {
        setWishlist(Array.isArray(resW.data) ? resW.data : []);
        setBooks(Array.isArray(resB.data) ? resB.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const inWishlist = (bookId) =>
    wishlist.some((w) => Number(w.libri_id) === Number(bookId));

  const toggleWishlist = async (book) => {
    const existing = wishlist.find((w) => Number(w.libri_id) === Number(book.id));
    if (existing) {
      if (await window.confirm(`Remove "${book.titulli}" from your wishlist?`)) {
        axios.delete(`http://localhost:5000/wishlists/${existing.id}`).then(() => {
          setWishlist((prev) => prev.filter((w) => w.id !== existing.id));
        });
      }
    } else {
      axios
        .post("http://localhost:5000/wishlists", {
          perdoruesi_id: user.id,
          libri_id: book.id,
        })
        .then(() => {
          setWishlist((prev) => [
            ...prev,
            {
              id: Date.now(),
              libri_id: book.id,
              titulli: book.titulli,
              foto_kopertines: book.foto_kopertines,
            },
          ]);
        });
    }
  };

  const availableBooks = books.filter((b) => !inWishlist(b.id));

  return (
    <UserLayout
      pageTitle="My Wishlist"
      pageSubtitle="Books you want to read"
    >
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>
          Loading...
        </div>
      ) : (
        <>
          {availableBooks.length > 0 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                border: `1px solid ${borderColor}`,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 14,
                  color: "#0f172a",
                }}
              >
                Add a book to your wishlist
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {availableBooks.slice(0, 12).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => toggleWishlist(b)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      border: `1px solid ${borderColor}`,
                      background: "#f8fafc",
                      color: "#334155",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all .12s ease",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(37,99,235,0.08)";
                      e.currentTarget.style.borderColor = "rgba(37,99,235,0.20)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  >
                    + {b.titulli}
                  </button>
                ))}
                {availableBooks.length > 12 && (
                  <div
                    style={{
                      padding: "8px 14px",
                      color: "#94a3b8",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    +{availableBooks.length - 12} more
                  </div>
                )}
              </div>
            </div>
          )}

          {wishlist.length === 0 ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                background: "#fff",
                borderRadius: 18,
                border: `1px solid ${borderColor}`,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                Your wishlist is empty
              </div>
              <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>
                Add books above to save them for later.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
                gap: 14,
              }}
            >
              {wishlist.map((w) => {
                const authorBook = books.find((b) => Number(b.id) === Number(w.libri_id));
                return (
                <div
                  key={w.id}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: `1px solid ${borderColor}`,
                    boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
                    overflow: "hidden",
                    transition: "transform .15s ease, box-shadow .15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,23,42,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.06)";
                  }}
                >
                  {w.foto_kopertines ? (
                    <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
                      <img src={w.foto_kopertines} alt={w.titulli} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                  ) : (
                    <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 600, fontSize: 13 }}>No cover</div>
                  )}
                  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{w.titulli}</div>
                    {authorBook?.autor_emri && <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{authorBook.autor_emri} {authorBook.autor_mbiemri}</div>}
                    {authorBook?.isbn && <div style={{ fontSize: 11, color: "#94a3b8" }}>ISBN: {authorBook.isbn}</div>}
                    <button
                      onClick={() =>
                        axios
                          .delete(`http://localhost:5000/wishlists/${w.id}`)
                          .then(() =>
                            setWishlist((prev) =>
                              prev.filter((x) => x.id !== w.id),
                            ),
                          )
                      }
                      className="btn btnGhost"
                      style={{ alignSelf: "flex-start", marginTop: 6, color: "#dc2626", fontSize: 12 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </UserLayout>
  );
}
