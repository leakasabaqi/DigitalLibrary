import { useState, useEffect } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";
import { showToast } from "../components/Toast";

const borderColor = "rgba(15,23,42,0.10)";

export default function UserBookmarks() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookmarks, setBookmarks] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ libri_id: "", faqja: "", shenime: "" });
  const [editing, setEditing] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 980);
  const [deleting, setDeleting] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.libri_id) return;
    const payload = { ...form, perdoruesi_id: user.id };
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/bookmarks/${editing.id}`, payload);
        setEditing(null);
        showToast("Bookmark updated.", "success");
      } else {
        await axios.post("http://localhost:5000/bookmarks", payload);
        showToast("Bookmark saved.", "success");
      }
      setForm({ libri_id: "", faqja: "", shenime: "" });
      setShowForm(false);
      refresh();
    } catch {
      showToast("Error saving bookmark.", "error");
    }
  };

  const startEdit = (b) => {
    setEditing(b);
    setForm({ libri_id: b.libri_id, faqja: b.faqja || "", shenime: b.shenime || "" });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (deleting) return;
    if (!await window.confirm("Delete this bookmark?")) return;
    setDeleting(id);
    try {
      await axios.delete(`http://localhost:5000/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      showToast("Bookmark deleted.", "success");
    } catch {
      showToast("Error deleting bookmark.", "error");
    }
    setDeleting(null);
  };

  const bookData = (id) => books.find((b) => Number(b.id) === Number(id));

  const coverS = (id) => {
    const b = bookData(id);
    return b ? b.foto_kopertines : null;
  };

  return (
    <UserLayout pageTitle="My Bookmarks" pageSubtitle="Save notes and page numbers from your books">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>Loading...</div>
      ) : (
        <>
          {!showForm && (
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => { setEditing(null); setForm({ libri_id: "", faqja: "", shenime: "" }); setShowForm(true); }}
                style={{
                  padding: "12px 24px", borderRadius: 12, border: "none",
                  background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                + New Bookmark
              </button>
            </div>
          )}

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
              <div className="btnRow" style={{ marginTop: 4 }}>
                <button type="button" className="btn btnGhost" onClick={() => { setShowForm(false); setEditing(null); setForm({ libri_id: "", faqja: "", shenime: "" }); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btnAccent">
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          )}

          {bookmarks.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No bookmarks yet</div>
              <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>Save notes and page numbers while you read.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "320px"}, 1fr))`, gap: 16 }}>
              {bookmarks.map((b) => {
                const cover = coverS(b.libri_id);
                return (
                  <div key={b.id} style={{
                    background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`,
                    boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
                    display: "flex", gap: 16, overflow: "hidden", alignItems: "center",
                    transition: "transform .15s ease, box-shadow .15s ease",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(15,23,42,0.10)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(15,23,42,0.06)"; }}
                  >
                    {cover ? (
                      <div style={{ width: 90, height: 130, flexShrink: 0, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 8, marginLeft: 16 }}>
                        <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 4 }} />
                      </div>
                    ) : (
                      <div style={{ width: 90, height: 130, background: "#f1f5f9", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 600, fontSize: 11 }}>No<br/>cover</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0, padding: "16px 16px 16px 0", display: "flex", flexDirection: "column" }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 2 }}>{bookData(b.libri_id)?.titulli || "Unknown"}</div>
                      {b.faqja && <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 8 }}>Page {b.faqja}</div>}
                      <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.6, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {b.shenime}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button type="button" className="btn btnGhost" onClick={() => startEdit(b)}>Edit</button>
                        <button type="button" className="btn btnGhost" onClick={() => handleDelete(b.id)} disabled={deleting === b.id}>
                          {deleting === b.id ? "..." : "Delete"}
                        </button>
                      </div>
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

