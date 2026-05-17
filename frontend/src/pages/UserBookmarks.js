import { useState, useEffect } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";

const borderColor = "rgba(15,23,42,0.10)";

export default function UserBookmarks() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookmarks, setBookmarks] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ libri_id: "", faqja: "", shenime: "" });
  const [editing, setEditing] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 980);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      axios.get("http://localhost:5000/bookmarks"),
      axios.get("http://localhost:5000/books"),
    ]).then(([resBM, resB]) => {
      const bm = Array.isArray(resBM.data) ? resBM.data : [];
      setBookmarks(bm.filter((b) => Number(b.perdoruesi_id) === Number(user.id)));
      setBooks(Array.isArray(resB.data) ? resB.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const refresh = () => {
    axios.get("http://localhost:5000/bookmarks").then((res) => {
      const bm = Array.isArray(res.data) ? res.data : [];
      setBookmarks(bm.filter((b) => Number(b.perdoruesi_id) === Number(user.id)));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.libri_id) return;
    const payload = { ...form, perdoruesi_id: user.id };
    if (editing) {
      axios.put(`http://localhost:5000/bookmarks/${editing.id}`, payload).then(() => {
        setEditing(null); setForm({ libri_id: "", faqja: "", shenime: "" }); setShowForm(false); refresh();
      });
    } else {
      axios.post("http://localhost:5000/bookmarks", payload).then(() => {
        setForm({ libri_id: "", faqja: "", shenime: "" }); setShowForm(false); refresh();
      });
    }
  };

  const startEdit = (b) => {
    setEditing(b); setForm({ libri_id: b.libri_id, faqja: b.faqja || "", shenime: b.shenime || "" }); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!await window.confirm("Delete this bookmark?")) return;
    axios.delete(`http://localhost:5000/bookmarks/${id}`).then(refresh);
  };

  const bookName = (id) => { const b = books.find((b) => Number(b.id) === Number(id)); return b ? b.titulli : "Unknown"; };

  return (
    <UserLayout pageTitle="My Bookmarks" pageSubtitle="Save notes and page numbers from your books">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>Loading...</div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => { setShowForm((p) => !p); if (!showForm) { setEditing(null); setForm({ libri_id: "", faqja: "", shenime: "" }); } }}
              style={{
                padding: "12px 24px", borderRadius: 12, border: "none",
                background: showForm ? "#f1f5f9" : "#2563eb",
                color: showForm ? "#334155" : "#fff", fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit", transition: "all .12s ease",
              }}
            >
              {showForm ? "Cancel" : "+ New Bookmark"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} style={{
              background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`,
              padding: 24, marginBottom: 24, display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div className="field">
                <label className="label">Book</label>
                <select className="select" value={form.libri_id} onChange={(e) => setForm((p) => ({ ...p, libri_id: e.target.value }))} required>
                  <option value="">-- Select a book --</option>
                  {books.map((b) => (<option key={b.id} value={b.id}>{b.titulli}</option>))}
                </select>
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div className="field" style={{ flex: "0 1 120px" }}>
                  <label className="label">Page (optional)</label>
                  <input className="input" type="number" min={1} value={form.faqja} onChange={(e) => setForm((p) => ({ ...p, faqja: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <label className="label">Note</label>
                <textarea className="textarea" value={form.shenime} onChange={(e) => setForm((p) => ({ ...p, shenime: e.target.value }))} rows={3} placeholder="What did you want to remember?" required />
              </div>
              <button type="submit" style={{
                padding: "11px 24px", borderRadius: 12, border: "none",
                background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start",
              }}>
                {editing ? "Update" : "Save"}
              </button>
            </form>
          )}

          {bookmarks.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No bookmarks yet</div>
              <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>Save notes and page numbers while you read.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "320px"}, 1fr))`, gap: 16 }}>
              {bookmarks.map((b) => (
                <div key={b.id} style={{
                  background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`,
                  borderLeft: "6px solid #2563eb", boxShadow: "0 8px 30px rgba(15,23,42,0.06)", padding: 24,
                  display: "flex", flexDirection: "column",
                  transition: "transform .15s ease, box-shadow .15s ease",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(15,23,42,0.10)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(15,23,42,0.06)"; }}
                >
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>{bookName(b.libri_id)}</div>
                  {b.faqja && <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 10 }}>Page {b.faqja}</div>}
                  <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.6, marginBottom: 14, flex: 1 }}>
                    {b.shenime}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    <button onClick={() => startEdit(b)} style={{
                      padding: "8px 14px", borderRadius: 10, border: `1px solid ${borderColor}`,
                      background: "transparent", color: "#2563eb", fontWeight: 700, fontSize: 12,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>Edit</button>
                    <button onClick={() => handleDelete(b.id)} style={{
                      padding: "8px 14px", borderRadius: 10, border: `1px solid ${borderColor}`,
                      background: "transparent", color: "#dc2626", fontWeight: 700, fontSize: 12,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>Delete</button>
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
