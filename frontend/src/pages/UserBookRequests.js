import { useState, useEffect } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";
import { showToast } from "../components/Toast";

const borderColor = "rgba(15,23,42,0.10)";

const statusStyle = (s) => {
  switch (s) {
    case "E Miratuar": return { color: "#16a34a", bg: "rgba(22,163,74,0.10)" };
    case "E Refuzuar": return { color: "#dc2626", bg: "rgba(220,38,38,0.10)" };
    default: return { color: "#f59e0b", bg: "rgba(245,158,11,0.10)" };
  }
};

export default function UserBookRequests() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ titulli_librit: "", autori: "" });

  useEffect(() => {
    if (!user) return;
    axios.get("http://localhost:5000/book-requests").then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setRequests(data.filter((r) => Number(r.perdoruesi_id) === Number(user.id)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const refresh = () => {
    axios.get("http://localhost:5000/book-requests").then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setRequests(data.filter((r) => Number(r.perdoruesi_id) === Number(user.id)));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulli_librit) return;
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/book-requests/${editing.id}`, {
          titulli_librit: form.titulli_librit, autori: form.autori, statusi: editing.statusi,
        });
        showToast("Request updated.", "success");
      } else {
        await axios.post("http://localhost:5000/book-requests", {
          perdoruesi_id: user.id, titulli_librit: form.titulli_librit, autori: form.autori, statusi: "Ne Pritje",
        });
        showToast("Request sent!", "success");
      }
      setForm({ titulli_librit: "", autori: "" });
      setEditing(null);
      setShowForm(false);
      refresh();
    } catch (err) {
      showToast("Error saving request.", "error");
    }
  };

  const startEdit = (r) => {
    setEditing(r);
    setForm({ titulli_librit: r.titulli_librit, autori: r.autori || "" });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelForm = () => {
    setForm({ titulli_librit: "", autori: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!await window.confirm("Delete this request?")) return;
    try {
      await axios.delete(`http://localhost:5000/book-requests/${id}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showToast("Request deleted.", "success");
    } catch (err) {
      showToast("Error deleting request.", "error");
    }
  };

  return (
    <UserLayout pageTitle="Book Requests" pageSubtitle="Request books you'd like to see added">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>Loading...</div>
      ) : (
        <>
          {!showForm && (
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: "12px 24px", borderRadius: 12, border: "none",
                  background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                + New Request
              </button>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} style={{
              background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`,
              padding: 24, marginBottom: 24, display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div className="field">
                <label className="label">Book Title</label>
                <input className="input" value={form.titulli_librit} onChange={(e) => setForm((p) => ({ ...p, titulli_librit: e.target.value }))} required />
              </div>
              <div className="field">
                <label className="label">Author (optional)</label>
                <input className="input" value={form.autori} onChange={(e) => setForm((p) => ({ ...p, autori: e.target.value }))} />
              </div>
              <div className="btnRow" style={{ marginTop: 4 }}>
                <button type="button" className="btn btnGhost" onClick={cancelForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btnAccent">
                  {editing ? "Save Changes" : "Send Request"}
                </button>
              </div>
            </form>
          )}

          {requests.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No requests yet</div>
              <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>Request a book and admins will review it.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {requests.map((r) => {
                const st = statusStyle(r.statusi);
                return (
                  <div key={r.id} style={{
                    background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`,
                    borderLeft: `6px solid ${st.color}`, boxShadow: "0 8px 30px rgba(15,23,42,0.06)", padding: 24,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{r.titulli_librit}</div>
                        {r.autori && <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600, marginTop: 2 }}>by {r.autori}</div>}
                      </div>
                      <span style={{
                        padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                        background: st.bg, color: st.color, whiteSpace: "nowrap", flexShrink: 0,
                      }}>
                        {r.statusi}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                      <button type="button" className="btn btnGhost" onClick={() => startEdit(r)}>Edit</button>
                      <button type="button" className="btn btnGhost" onClick={() => handleDelete(r.id)}>Delete</button>
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
