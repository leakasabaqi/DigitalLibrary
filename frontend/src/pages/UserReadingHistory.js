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
                gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "340px"}, 1fr))`,
                gap: isMobile ? 12 : 16,
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
                      borderRadius: 18,
                      border: `1px solid ${borderColor}`,
                      borderLeft: isEditing ? "6px solid #f59e0b" : `6px solid ${st.color}`,
                      boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
                      padding: isMobile ? 14 : 20,
                      transition: "transform .15s ease, box-shadow .15s ease",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 20 }}>
                      {cover ? (
                        <img
                          src={cover}
                          alt={h.libri_titulli}
                          style={{
                            width: isMobile ? "100%" : 140,
                            height: isMobile ? 180 : 200,
                            borderRadius: 12,
                            objectFit: "cover",
                            flexShrink: 0,
                            background: "#f1f5f9",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: isMobile ? "100%" : 140,
                            height: isMobile ? 120 : 200,
                            borderRadius: 12,
                            background: "#f1f5f9",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#94a3b8",
                            fontWeight: 600,
                            fontSize: 13,
                            textAlign: "center",
                            padding: 10,
                          }}
                        >
                          No cover
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 4 }}>
                          <div style={{ fontWeight: 800, fontSize: isMobile ? 15 : 16, color: "#0f172a" }}>
                            {h.libri_titulli}
                          </div>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              background: st.bg,
                              color: st.color,
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}
                          >
                            {st.text}
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: isMobile ? 12 : 20, marginTop: 12 }}>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
                              Progress
                            </div>
                            <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: st.color }}>
                              {percent}%
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
                              Page
                            </div>
                            <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: "#0f172a" }}>
                              {currentPage}{totalPages > 0 ? ` / ${totalPages}` : ""}
                            </div>
                          </div>
                        </div>

                        {isEditing && (
                          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <input
                              className="input"
                              type="number"
                              min={1}
                              max={totalPages || undefined}
                              value={editPage}
                              onChange={(e) => setEditPage(e.target.value)}
                              style={{
                                width: isMobile ? 80 : 100,
                                padding: "8px 10px",
                                fontSize: 13,
                                ...inputStyle,
                              }}
                              autoFocus
                            />
                            {!isMobile && (
                              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                                / {totalPages}
                              </span>
                            )}
                            <button
                              onClick={() => saveEdit(h)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: 10,
                                border: "none",
                                background: "#2563eb",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              style={{
                                padding: "8px 16px",
                                borderRadius: 10,
                                border: `1px solid ${borderColor}`,
                                background: "transparent",
                                color: "#64748b",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        <div style={{ marginTop: "auto", paddingTop: isMobile ? 12 : 16 }}>
                          <div
                            style={{
                              width: "100%",
                              height: isMobile ? 8 : 10,
                              background: "rgba(15,23,42,0.08)",
                              borderRadius: 999,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${percent}%`,
                                height: "100%",
                                background: percent === 100 ? "#16a34a" : "#2563eb",
                                borderRadius: 999,
                                transition: "width 0.5s ease",
                              }}
                            />
                          </div>
                        </div>

                        {!isEditing && (
                          <div style={{ display: "flex", gap: 8, marginTop: isMobile ? 12 : 14 }}>
                            <button
                              onClick={() => startEdit(h)}
                              style={{
                                padding: "8px 14px",
                                borderRadius: 10,
                                border: `1px solid ${borderColor}`,
                                background: "transparent",
                                color: "#2563eb",
                                fontWeight: 700,
                                fontSize: 12,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                transition: "background .12s ease",
                                flex: isMobile ? 1 : undefined,
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(37,99,235,0.08)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              Edit Progress
                            </button>
                            <button
                              onClick={() => handleDelete(h.id)}
                              style={{
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
                                flex: isMobile ? 1 : undefined,
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.08)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              Delete
                            </button>
                          </div>
                        )}
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
