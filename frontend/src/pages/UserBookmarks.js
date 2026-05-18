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
  const [deleting, setDeleting] = useState(null);

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
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bookmarks.map((b) => {
                const cover = coverS(b.libri_id);
                return (
                  <div key={b.id} style={{
                    background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`,
                    borderLeft: "6px solid #f59e0b",
                    boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
                    overflow: "hidden",
                    transition: "transform .15s ease, box-shadow .15s ease",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(15,23,42,0.10)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(15,23,42,0.06)"; }}
                  >
                    <div style={{ padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
                      {cover ? (
                        <div style={{ width: 64, height: 88, flexShrink: 0, background: "#f1f5f9", borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ width: 64, height: 88, flexShrink: 0, background: "#f1f5f9", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 600, fontSize: 10, textAlign: "center", lineHeight: 1.3 }}>No cover</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                          <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{bookData(b.libri_id)?.titulli || "Unknown"}</div>
                          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            <button onClick={() => startEdit(b)} title="Edit" style={{
                              width: 32, height: 32, borderRadius: 8, border: "none",
                              background: "rgba(37,99,235,0.08)", color: "#2563eb",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "background .12s",
                            }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(37,99,235,0.16)"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(37,99,235,0.08)"}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                            </button>
                            <button onClick={() => handleDelete(b.id)} disabled={deleting === b.id} title="Delete" style={{
                              width: 32, height: 32, borderRadius: 8, border: "none",
                              background: "rgba(220,38,38,0.08)", color: "#dc2626",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "background .12s", opacity: deleting === b.id ? 0.5 : 1,
                            }}
                              onMouseEnter={(e) => { if (!deleting) e.currentTarget.style.background = "rgba(220,38,38,0.16)"; }}
                              onMouseLeave={(e) => { if (!deleting) e.currentTarget.style.background = "rgba(220,38,38,0.08)"; }}
                            >
                              {deleting === b.id ? (
                                <span style={{ fontSize: 11, fontWeight: 700 }}>...</span>
                              ) : (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                              )}
                            </button>
                          </div>
                        </div>
                        {b.faqja && <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>Page {b.faqja}</div>}
                        <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {b.shenime}
                        </div>
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

