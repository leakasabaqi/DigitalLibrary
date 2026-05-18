import { useState, useEffect } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";

const borderColor = "rgba(15,23,42,0.10)";

const statusLabel = (status) => {
  switch (status) {
    case "completed":
      return { text: "Completed", color: "#16a34a", bg: "rgba(22,163,74,0.10)" };
    case "duke e lexuar":
      return { text: "Reading", color: "#2563eb", bg: "rgba(37,99,235,0.10)" };
    default:
      return { text: status || "Unknown", color: "#64748b", bg: "rgba(100,116,139,0.10)" };
  }
};

const calcPercent = (faqja, total) => {
  if (!total || total <= 0) return 0;
  return Math.min(Math.round((faqja / total) * 100), 100);
};

export default function UserReadingHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 980);
  const [history, setHistory] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({ libri_id: "", faqja_aktuale: "" });
  const [editingId, setEditingId] = useState(null);
  const [editPage, setEditPage] = useState("");

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      axios.get("http://localhost:5000/reading-history?perdoruesi_id=" + user.id),
      axios.get("http://localhost:5000/books"),
    ])
      .then(([resH, resB]) => {
        setHistory(Array.isArray(resH.data) ? resH.data : []);
        setBooks(Array.isArray(resB.data) ? resB.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const refreshHistory = () => {
    axios
      .get("http://localhost:5000/reading-history?perdoruesi_id=" + user.id)
      .then((res) => setHistory(Array.isArray(res.data) ? res.data : []));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.libri_id || !form.faqja_aktuale) return;
    const book = books.find((b) => Number(b.id) === Number(form.libri_id));
    const page = parseInt(form.faqja_aktuale, 10) || 0;
    const percent = calcPercent(page, book?.numri_faqeve);
    axios
      .post("http://localhost:5000/reading-history", {
        perdoruesi_id: user.id,
        libri_id: form.libri_id,
        faqja_aktuale: page,
        perqindja_leximit: percent,
        statusi: percent === 100 ? "completed" : "duke e lexuar",
      })
      .then(() => {
        setForm({ libri_id: "", faqja_aktuale: "" });
        setShowForm(false);
        refreshHistory();
      })
      .catch(() => alert("Gabim gjatë ruajtjes!"));
  };

  const startEdit = (h) => {
    setEditingId(h.id);
    setEditPage(h.faqja_aktuale || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPage("");
  };

  const saveEdit = (h) => {
    const page = parseInt(editPage, 10) || 0;
    const percent = calcPercent(page, h.numri_faqeve);
    axios
      .put("http://localhost:5000/reading-history/" + h.id, {
        perdoruesi_id: h.perdoruesi_id,
        libri_id: h.libri_id,
        data_fillimit: h.data_fillimit,
        data_fundit: h.data_fundit,
        faqja_aktuale: page,
        perqindja_leximit: percent,
        statusi: percent === 100 ? "completed" : "duke e lexuar",
      })
      .then(() => {
        setEditingId(null);
        setEditPage("");
        refreshHistory();
      })
      .catch(() => alert("Gabim gjatë përditësimit!"));
  };

  const handleDelete = async (id) => {
    if (!await window.confirm("A jeni i sigurt që doni të fshini këtë histori leximi?"))
      return;
    axios
      .delete("http://localhost:5000/reading-history/" + id)
      .then(() => refreshHistory())
      .catch(() => alert("Gabim gjatë fshirjes!"));
  };

  const alreadyReading = (bookId) =>
    history.some((h) => Number(h.libri_id) === Number(bookId));

  const inputStyle = isMobile ? { width: "100%" } : {};
  const btnFull = isMobile ? { width: "100%" } : {};

  return (
    <UserLayout
      pageTitle="Reading History"
      pageSubtitle="Books you've been reading"
    >
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>
          Loading your reading history...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setShowForm((p) => !p)}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                background: showForm ? "#f1f5f9" : "#2563eb",
                color: showForm ? "#334155" : "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .12s ease",
                ...btnFull,
              }}
            >
              {showForm ? "Cancel" : "+ Add Book"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleAdd}
              style={{
                background: "#fff",
                borderRadius: 18,
                border: `1px solid ${borderColor}`,
                padding: isMobile ? 16 : 24,
                marginBottom: 24,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 16,
                alignItems: isMobile ? "stretch" : "flex-end",
              }}
            >
              <div className="field" style={isMobile ? {} : { flex: "1 1 240px", minWidth: 200 }}>
                <label className="label">Book</label>
                <select
                  className="select"
                  value={form.libri_id}
                  onChange={(e) => setForm((p) => ({ ...p, libri_id: e.target.value }))}
                  required
                >
                  <option value="">-- Select a book --</option>
                  {books
                    .filter((b) => !alreadyReading(b.id))
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.titulli} ({b.numri_faqeve || "?"} fq)
                      </option>
                    ))}
                </select>
              </div>
              <div className="field" style={isMobile ? {} : { flex: "0 1 140px" }}>
                <label className="label">Current Page</label>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={form.faqja_aktuale}
                  onChange={(e) => setForm((p) => ({ ...p, faqja_aktuale: e.target.value }))}
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "11px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  height: 44,
                  ...btnFull,
                }}
              >
                Save
              </button>
            </form>
          )}

          {history.length === 0 ? (
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
                No reading history yet
              </div>
              <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>
                Click "+ Add Book" to start tracking your reading progress.
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
              {history.map((h) => {
                const st = statusLabel(h.statusi);
                const percent = h.perqindja_leximit || 0;
                const currentPage = h.faqja_aktuale || 0;
                const totalPages = h.numri_faqeve || 0;
                const cover = h.foto_kopertines;
                const isEditing = editingId === h.id;

                return (
                  <div
                    key={h.id}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      border: `1px solid ${borderColor}`,
                      boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
                      overflow: "hidden",
                      transition: "transform .15s ease, box-shadow .15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,23,42,0.10)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.06)"; }}
                  >
                    {cover ? (
                      <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
                        <img src={cover} alt={h.libri_titulli} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                    ) : (
                      <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 600, fontSize: 13 }}>No cover</div>
                    )}
                    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, flexWrap: "wrap" }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", flex: 1 }}>{h.libri_titulli}</div>
                        <span style={{ padding: "2px 7px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: st.bg, color: st.color, whiteSpace: "nowrap", flexShrink: 0 }}>{st.text}</span>
                      </div>

                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 1 }}>Progress</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: st.color }}>{percent}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 1 }}>Page</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{currentPage}{totalPages > 0 ? ` / ${totalPages}` : ""}</div>
                        </div>
                      </div>

                      <div style={{ width: "100%", height: 6, background: "rgba(15,23,42,0.08)", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: `${percent}%`, height: "100%", background: percent === 100 ? "#16a34a" : "#2563eb", borderRadius: 999, transition: "width 0.5s ease" }} />
                      </div>

                      {isEditing && (
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                          <input className="input" type="number" min={1} max={totalPages || undefined} value={editPage} onChange={(e) => setEditPage(e.target.value)} style={{ width: 70, padding: "6px 8px", fontSize: 12 }} autoFocus />
                          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>/ {totalPages}</span>
                          <button type="button" className="btn btnGhost" onClick={() => saveEdit(h)}>Save</button>
                          <button type="button" className="btn btnGhost" onClick={cancelEdit}>Cancel</button>
                        </div>
                      )}

                      {!isEditing && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button type="button" className="btn btnGhost" onClick={() => startEdit(h)}>Edit</button>
                          <button type="button" className="btn btnGhost" onClick={() => handleDelete(h.id)}>Delete</button>
                        </div>
                      )}
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
