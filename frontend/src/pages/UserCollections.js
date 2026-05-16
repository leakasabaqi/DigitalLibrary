import { useState, useEffect } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";

const borderColor = "rgba(15,23,42,0.10)";

export default function UserCollections() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ emertimi: "", pershkrimi: "", a_eshte_publike: 0 });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios
      .get("http://localhost:5000/collections")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCollections(data.filter((c) => Number(c.perdoruesi_id) === Number(user.id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const refresh = () => {
    axios.get("http://localhost:5000/collections").then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setCollections(data.filter((c) => Number(c.perdoruesi_id) === Number(user.id)));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.emertimi) return;
    const payload = { ...form, perdoruesi_id: user.id };

    if (editing) {
      axios.put(`http://localhost:5000/collections/${editing.id}`, payload).then(() => {
        setEditing(null);
        setForm({ emertimi: "", pershkrimi: "", a_eshte_publike: 0 });
        setShowForm(false);
        refresh();
      });
    } else {
      axios.post("http://localhost:5000/collections", payload).then(() => {
        setForm({ emertimi: "", pershkrimi: "", a_eshte_publike: 0 });
        setShowForm(false);
        refresh();
      });
    }
  };

  const startEdit = (c) => {
    setEditing(c);
    setForm({ emertimi: c.emertimi, pershkrimi: c.pershkrimi || "", a_eshte_publike: c.a_eshte_publike });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this collection?")) return;
    axios.delete(`http://localhost:5000/collections/${id}`).then(refresh);
  };

  return (
    <UserLayout pageTitle="My Collections" pageSubtitle="Organize books into collections">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>Loading...</div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => { setShowForm((p) => !p); if (!showForm) { setEditing(null); setForm({ emertimi: "", pershkrimi: "", a_eshte_publike: 0 }); } }}
              style={{
                padding: "12px 24px", borderRadius: 12, border: "none",
                background: showForm ? "#f1f5f9" : "#2563eb",
                color: showForm ? "#334155" : "#fff", fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit", transition: "all .12s ease",
              }}
            >
              {showForm ? "Cancel" : "+ New Collection"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} style={{
              background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`,
              padding: 24, marginBottom: 24, display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div className="field">
                <label className="label">Collection Name</label>
                <input className="input" value={form.emertimi} onChange={(e) => setForm((p) => ({ ...p, emertimi: e.target.value }))} required />
              </div>
              <div className="field">
                <label className="label">Description (optional)</label>
                <textarea className="textarea" value={form.pershkrimi} onChange={(e) => setForm((p) => ({ ...p, pershkrimi: e.target.value }))} rows={3} />
              </div>
              <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="pub" checked={form.a_eshte_publike === 1} onChange={(e) => setForm((p) => ({ ...p, a_eshte_publike: e.target.checked ? 1 : 0 }))} />
                <label htmlFor="pub" style={{ fontWeight: 600, fontSize: 13, color: "#334155" }}>Make this collection public</label>
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

          {collections.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No collections yet</div>
              <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>Create a collection to organize your books.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {collections.map((c) => (
                <div key={c.id} style={{
                  background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`,
                  borderLeft: `6px solid ${c.a_eshte_publike ? "#2563eb" : "#94a3b8"}`,
                  boxShadow: "0 8px 30px rgba(15,23,42,0.06)", padding: 24,
                  display: "flex", flexDirection: "column",
                  transition: "transform .15s ease, box-shadow .15s ease",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(15,23,42,0.10)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(15,23,42,0.06)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{c.emertimi}</div>
                    <span style={{
                      padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                      background: c.a_eshte_publike ? "rgba(37,99,235,0.10)" : "rgba(148,163,184,0.10)",
                      color: c.a_eshte_publike ? "#2563eb" : "#64748b", whiteSpace: "nowrap",
                    }}>
                      {c.a_eshte_publike ? "Public" : "Private"}
                    </span>
                  </div>
                  {c.pershkrimi && <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{c.pershkrimi}</div>}
                  <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(c)} style={{
                      padding: "8px 14px", borderRadius: 10, border: `1px solid ${borderColor}`,
                      background: "transparent", color: "#2563eb", fontWeight: 700, fontSize: 12,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>Edit</button>
                    <button onClick={() => handleDelete(c.id)} style={{
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
