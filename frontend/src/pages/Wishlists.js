import React, { useState, useEffect } from "react";
import axios from "axios";

const Wishlists = () => {
  const [wishlist, setWishlist] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState({ perdoruesi_id: "", libri_id: "" });

  const fetchData = async () => {
    try {
      const [resW, resU, resB] = await Promise.all([
        axios.get("http://localhost:5000/wishlists"),
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/books"),
      ]);
      setWishlist(resW.data || []);
      setUsers(resU.data || []);
      setBooks(resB.data || []);
    } catch (err) {
      console.error("Gabim:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setRecord({ perdoruesi_id: "", libri_id: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/wishlists/${record.id}`, record);
      } else {
        await axios.post("http://localhost:5000/wishlists", record);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Gabim!");
    }
  };

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {isEditing ? "Edit Wishlist" : "Add to Wishlist"}
            </div>
            <div className="cardSubtitle">
              Manage books users want to save for later.
            </div>
          </div>
          <div className="help">{wishlist.length} items</div>
        </div>

        <form onSubmit={handleSubmit} className="formGrid" style={{ gap: 18 }}>
          <div className="field">
            <label className="label">User</label>
            <select
              className="select"
              name="perdoruesi_id"
              value={record.perdoruesi_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.emri} {u.mbiemri}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Book</label>
            <select
              className="select"
              name="libri_id"
              value={record.libri_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Book --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.titulli}
                </option>
              ))}
            </select>
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {isEditing ? "Update Wishlist" : "Add Wishlist"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btnGhost"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <div className="cardTitle">Wishlists</div>
            <div className="cardSubtitle">Current user wishlist entries.</div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
          }}
        >
          {wishlist.map((w) => {
            const bookInfo = books.find((b) => Number(b.id) === Number(w.libri_id));
            return (
            <div
              key={w.id}
              className="card"
              style={{ overflow: "hidden", borderRadius: 12 }}
            >
              {w.foto_kopertines ? (
                <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
                  <img src={w.foto_kopertines} alt={w.titulli} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              ) : (
                <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 600, fontSize: 13 }}>No cover</div>
              )}
              <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                <small className="help" style={{ margin: 0 }}>{w.emri} {w.mbiemri}</small>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{w.titulli}</div>
                {bookInfo?.autor_emri && <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{bookInfo.autor_emri} {bookInfo.autor_mbiemri}</div>}
                {bookInfo?.isbn && <div style={{ fontSize: 11, color: "#94a3b8" }}>ISBN: {bookInfo.isbn}</div>}
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button type="button" className="btn btnGhost" onClick={() => { setRecord(w); setIsEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
                  <button type="button" className="btn btnGhost" onClick={async () => { if (await window.confirm("Fshije?")) { await axios.delete(`http://localhost:5000/wishlists/${w.id}`); fetchData(); } }}>Delete</button>
                </div>
              </div>
            </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Wishlists;
