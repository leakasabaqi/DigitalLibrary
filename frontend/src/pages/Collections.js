import React, { useState, useEffect } from "react";
import axios from "axios";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState({
    perdoruesi_id: "",
    emertimi: "",
    pershkrimi: "",
    a_eshte_publike: 0,
  });

  const fetchData = async () => {
    try {
      const [resC, resU] = await Promise.all([
        axios.get("http://localhost:5000/collections"),
        axios.get("http://localhost:5000/users"),
      ]);
      setCollections(resC.data || []);
      setUsers(resU.data || []);
    } catch (err) {
      console.error("Gabim në ngarkim:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!record.perdoruesi_id) return alert("Ju lutem zgjidhni një përdorues!");

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/collections/${record.id}`,
          record,
        );
      } else {
        await axios.post("http://localhost:5000/collections", record);
      }
      setRecord({
        perdoruesi_id: "",
        emertimi: "",
        pershkrimi: "",
        a_eshte_publike: 0,
      });
      setIsEditing(false);
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
              {isEditing ? "Edit Collection" : "Create New Collection"}
            </div>
            <div className="cardSubtitle">
              Build and manage user collections with a clean interface.
            </div>
          </div>
          <div className="help">{collections.length} collections</div>
        </div>

        <form onSubmit={handleSubmit} className="formGrid" style={{ gap: 18 }}>
          <div className="field">
            <label className="label">Collection Owner</label>
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
            <label className="label">Title</label>
            <input
              className="input"
              type="text"
              name="emertimi"
              value={record.emertimi}
              onChange={handleChange}
              placeholder="Enter collection title"
              required
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Description</label>
            <textarea
              className="textarea"
              name="pershkrimi"
              value={record.pershkrimi}
              onChange={handleChange}
              placeholder="Describe this collection..."
            />
          </div>

          <div className="field">
            <label className="label">Visibility</label>
            <select
              className="select"
              name="a_eshte_publike"
              value={record.a_eshte_publike}
              onChange={handleChange}
            >
              <option value={0}>Private</option>
              <option value={1}>Public</option>
            </select>
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {isEditing ? "Update Collection" : "Create Collection"}
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <div className="cardTitle">Collections</div>
            <div className="cardSubtitle">
              Browse all saved collections in the system.
            </div>
          </div>
          <div className="help">{collections.length} items</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {collections.map((c) => (
            <div
              key={c.id}
              className="card"
              style={{ position: "relative", borderLeft: "5px solid #16a34a" }}
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
                  <small className="help">
                    {c.emri} {c.mbiemri}
                  </small>
                  <div
                    style={{ fontSize: 18, fontWeight: 700, margin: "8px 0" }}
                  >
                    {c.emertimi}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn btnGhost"
                    onClick={() => {
                      setRecord(c);
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
                      if (
                        window.confirm("A dëshironi ta fshini këtë koleksion?")
                      ) {
                        await axios.delete(
                          `http://localhost:5000/collections/${c.id}`,
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

              <p className="help" style={{ marginBottom: 12 }}>
                {c.pershkrimi || "No description available."}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                  color: "#64748b",
                  fontSize: 13,
                }}
              >
                <span>{c.a_eshte_publike === 1 ? "Public" : "Private"}</span>
                <span>
                  Krijuar më {new Date(c.data_krijimit).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
