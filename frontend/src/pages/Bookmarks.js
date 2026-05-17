import React, { useState, useEffect } from "react";
import axios from "axios";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState({
    perdoruesi_id: "",
    libri_id: "",
    faqja: "",
    shenime: "",
  });

  const fetchData = async () => {
    try {
      const [resBM, resU, resB] = await Promise.all([
        axios.get("http://localhost:5000/bookmarks"),
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/books"),
      ]);
      setBookmarks(resBM.data || []);
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
    const { name, value } = e.target;
    setRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setRecord({ perdoruesi_id: "", libri_id: "", faqja: "", shenime: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/bookmarks/${record.id}`, record);
      } else {
        await axios.post("http://localhost:5000/bookmarks", record);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Gabim gjatë ruajtjes!");
    }
  };

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {isEditing ? "Edit Bookmark" : "Add New Bookmark"}
            </div>
            <div className="cardSubtitle">
              Save and manage bookmarks for library users.
            </div>
          </div>
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

          <div className="field">
            <label className="label">Page</label>
            <input
              className="input"
              type="number"
              name="faqja"
              value={record.faqja}
              onChange={handleChange}
              placeholder="Enter bookmark page"
              required
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Notes</label>
            <textarea
              className="textarea"
              name="shenime"
              value={record.shenime}
              onChange={handleChange}
              placeholder="Write a note for this bookmark..."
            />
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {isEditing ? "Save Changes" : "Add Bookmark"}
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
            <div className="cardTitle">Bookmarks</div>
            <div className="cardSubtitle">
              All user bookmarks in the library.
            </div>
          </div>
          <div className="help">{bookmarks.length} total</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="card"
              style={{ position: "relative", borderLeft: "5px solid #2563eb" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>
                    {bm.titulli}
                  </div>
                  <div className="help">
                    {bm.emri} {bm.mbiemri}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn btnGhost"
                    onClick={() => {
                      setRecord(bm);
                      setIsEditing(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btnGhost"
                    onClick={async () => {
                      if (await window.confirm("Fshije?")) {
                        await axios.delete(
                          `http://localhost:5000/bookmarks/${bm.id}`,
                        );
                        fetchData();
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="hr" />

              <div style={{ display: "grid", gap: 6 }}>
                <div className="help">
                  Page: <strong>{bm.faqja}</strong>
                </div>
                <div style={{ color: "#475569" }}>
                  {bm.shenime || "No notes available."}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
