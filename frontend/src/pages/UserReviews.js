import { useState, useEffect } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";
import { showToast } from "../components/Toast";

export default function UserReviews() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      axios.get("http://localhost:5000/reviews"),
      axios.get("http://localhost:5000/books"),
    ])
      .then(([resR, resB]) => {
        const allReviews = Array.isArray(resR.data) ? resR.data : [];
        setReviews(allReviews.filter((r) => Number(r.perdoruesi_id) === Number(user.id)));
        setBooks(Array.isArray(resB.data) ? resB.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const reviewedBookIds = new Set(reviews.map((r) => Number(r.libri_id)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;
    setSubmitting(true);
    try {
      const payload = { perdoruesi_id: user.id, libri_id: selectedBook, vleresimi: rating, komenti: comment };
      if (editingId) {
        await axios.put(`http://localhost:5000/reviews/${editingId}`, payload);
      } else {
        await axios.post("http://localhost:5000/reviews", payload);
      }
      setSelectedBook(""); setRating(5); setComment(""); setEditingId(null);
      const res = await axios.get("http://localhost:5000/reviews");
      setReviews((Array.isArray(res.data) ? res.data : []).filter((r) => Number(r.perdoruesi_id) === Number(user.id)));
    } catch (err) {
      showToast("Failed to save review.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setSelectedBook(review.libri_id);
    setRating(review.vleresimi);
    setComment(review.komenti || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!await window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`http://localhost:5000/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      showToast("Failed to delete review.", "error");
    }
  };

  const getBookName = (id) => {
    const b = books.find((bk) => Number(bk.id) === Number(id));
    return b ? b.titulli : "Unknown";
  };

  const Star = ({ value, onClick, onEnter, onLeave }) => (
    <span
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ fontSize: 22, cursor: "pointer", color: value <= (hover || rating) ? "#facc15" : "#cbd5e1", transition: "color .12s ease", userSelect: "none" }}
    >
      ★
    </span>
  );

  return (
    <UserLayout pageTitle="My Reviews" pageSubtitle="Rate and review books you've read">
      <div style={{ padding: 18 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#64748b", fontWeight: 600 }}>Loading...</div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="cardHeader">
                <div>
                  <div className="cardTitle">{editingId ? "Edit Review" : "Write a Review"}</div>
                  <div className="cardSubtitle">Share your thoughts about a book</div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="field">
                    <label className="label">Select Book</label>
                    <select className="select" value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} required>
                      <option value="">-- Choose a book --</option>
                      {books
                        .filter((b) => !reviewedBookIds.has(Number(b.id)) || Number(b.id) === Number(selectedBook))
                        .map((b) => <option key={b.id} value={b.id}>{b.titulli}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="label">Rating</label>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <Star key={v} value={v} onClick={() => setRating(v)} onEnter={() => setHover(v)} onLeave={() => setHover(0)} />
                      ))}
                      <span style={{ fontSize: 13, color: "#64748b", marginLeft: 8, alignSelf: "center", fontWeight: 600 }}>{rating}/5</span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Comment</label>
                    <textarea className="textarea" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you think of this book?" style={{ minHeight: 80 }} />
                  </div>
                  <div className="btnRow" style={{ marginTop: 4 }}>
                    {editingId && (
                      <button type="button" className="btn btnGhost" onClick={() => { setEditingId(null); setSelectedBook(""); setRating(5); setComment(""); }}>
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn btnAccent" disabled={submitting || !selectedBook}>
                      {submitting ? "Saving..." : editingId ? "Update Review" : "Submit Review"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {reviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#64748b", fontWeight: 600 }}>
                You haven't reviewed any books yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reviews.map((r) => (
                  <div key={r.id} className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{getBookName(r.libri_id)}</div>
                        <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                          {[1, 2, 3, 4, 5].map((v) => (
                            <span key={v} style={{ fontSize: 16, color: v <= r.vleresimi ? "#facc15" : "#cbd5e1" }}>★</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button type="button" className="btn btnGhost" onClick={() => startEdit(r)}>Edit</button>
                        <button type="button" className="btn btnGhost" onClick={() => handleDelete(r.id)}>Delete</button>
                      </div>
                    </div>
                    {r.komenti && (
                      <div style={{ fontSize: 13, color: "#475569", marginTop: 10, lineHeight: 1.5 }}>{r.komenti}</div>
                    )}
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
                      {r.emri && r.mbiemri ? `by ${r.emri} ${r.mbiemri}` : ""}
                      {(() => {
                        const d = new Date(r.created_at || r.data_krijimit || r.date_created);
                        return isNaN(d.getTime()) ? "" : " · " + d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </UserLayout>
  );
}
