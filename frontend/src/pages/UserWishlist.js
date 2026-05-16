import { useState, useEffect } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";

const borderColor = "rgba(15,23,42,0.10)";

export default function UserWishlist() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [wishlist, setWishlist] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    update();
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

  const toggleWishlist = (book) => {
    const existing = wishlist.find((w) => Number(w.libri_id) === Number(book.id));
    if (existing) {
      if (window.confirm(`Remove "${book.titulli}" from your wishlist?`)) {
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
                gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "320px"}, 1fr))`,
                gap: 16,
              }}
            >
              {wishlist.map((w) => (
                <div
                  key={w.id}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    border: `1px solid ${borderColor}`,
                    borderLeft: "6px solid #2563eb",
                    boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
                    padding: 20,
                    display: "flex",
                    gap: 16,
                    flexDirection: isMobile ? "column" : "row",
                    transition: "transform .15s ease, box-shadow .15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 16px 48px rgba(15,23,42,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(15,23,42,0.06)";
                  }}
                >
                  {w.foto_kopertines ? (
                    <img
                      src={w.foto_kopertines}
                      alt={w.titulli}
                      style={{
                        width: isMobile ? "100%" : 100,
                        height: isMobile ? 140 : 140,
                        borderRadius: 10,
                        objectFit: "cover",
                        flexShrink: 0,
                        background: "#f1f5f9",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: isMobile ? "100%" : 100,
                        height: 140,
                        borderRadius: 10,
                        background: "#f1f5f9",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      No cover
                    </div>
                  )}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 16,
                        color: "#0f172a",
                        marginBottom: 4,
                      }}
                    >
                      {w.titulli}
                    </div>

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
                      style={{
                        marginTop: "auto",
                        alignSelf: "flex-start",
                        padding: "8px 14px",
                        borderRadius: 10,
                        border: `1px solid ${borderColor}`,
                        background: "transparent",
                        color: "#dc2626",
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "background .12s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(220,38,38,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </UserLayout>
  );
}
