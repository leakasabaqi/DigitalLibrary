import React, { useState, useEffect } from "react";
import axios from "axios";

const AddAuthor = () => {
  const [authors, setAuthors] = useState([]);
  const [author, setAuthor] = useState({
    emri: "",
    mbiemri: "",
    biografia: "",
    vendi: "",
    foto_profili: "",
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/authors");
      setAuthors(res.data);
    } catch (err) {
      console.log(err);
      alert("Gabim gjatë ngarkim të autorëve!");
    }
  };

  const handleChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUpdate = author.id ? true : false;
    const url = isUpdate
      ? `http://localhost:5000/authors/${author.id}`
      : "http://localhost:5000/authors";
    const method = isUpdate ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(author),
      });

      if (response.ok) {
        alert(isUpdate ? "Autori u përditësua!" : "Autori u shtua!");
        setAuthor({
          emri: "",
          mbiemri: "",
          biografia: "",
          vendi: "",
          foto_profili: "",
        });
        fetchAuthors();
      } else {
        const errorMsg = await response.text();
        alert("Gabim nga serveri: " + errorMsg);
      }
    } catch (err) {
      alert("Gabim lidhjeje me serverin!");
    }
  };

  const handleEdit = (a) => {
    setAuthor({ ...a });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // E dërgon përdoruesin lart te forma
  };

  const handleDelete = async (id) => {
    if (window.confirm("A dëshiron ta fshish autorin?")) {
      try {
        await axios.delete(`http://localhost:5000/authors/${id}`);
        fetchAuthors();
      } catch (err) {
        alert("Gabim gjatë fshirjes!");
      }
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* SECTION: Form e shtimit/editimit */}
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {author.id ? "Edit Author Profile" : "Create New Author"}
            </div>
            <div className="cardSubtitle">
              Fill in the details below to manage the author's public profile.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="formGrid" style={{ gap: 24 }}>
          
          {/* Image Preview Sidebar */}
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                  width: 120,
                  height: 120,
                  maxWidth: '100%',
                  borderRadius: 12,
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px dashed #cbd5e1'
              }}>
                {author.foto_profili ? (
                    <img src={author.foto_profili} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: 10 }}>No Preview Available</span>
                )}
              </div>
              <label className="label">Profile Preview</label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="field">
            <label className="label">First Name *</label>
            <input className="input" type="text" name="emri" value={author.emri || ""} placeholder="John" onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="label">Last Name *</label>
            <input className="input" type="text" name="mbiemri" value={author.mbiemri || ""} placeholder="Doe" onChange={handleChange} required />
          </div>

          <div className="field">
            <label className="label">Country</label>
            <input className="input" type="text" name="vendi" value={author.vendi || ""} placeholder="e.g. Albania" onChange={handleChange} />
          </div>

          <div className="field">
            <label className="label">Profile Image URL</label>
            <input className="input" type="text" name="foto_profili" value={author.foto_profili || ""} placeholder="https://image-link.com" onChange={handleChange} />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Biography</label>
            <textarea className="textarea" name="biografia" value={author.biografia || ""} placeholder="Write a short bio..." onChange={handleChange} rows="3" />
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1", marginTop: 8 }}>
            <button type="submit" className="btn btnAccent">
              {author.id ? "Update Profile" : "Register Author"}
            </button>
            {author.id && (
              <button type="button" className="btn btnGhost" onClick={() => setAuthor({ emri: "", mbiemri: "", biografia: "", vendi: "", foto_profili: "" })}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SECTION: Lista e autorëve */}
      <div style={{ marginTop: 40 }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: 0 }}>Active Authors</h2>
          <span className="help" style={{ background: '#e2e8f0', padding: '4px 12px', borderRadius: 20 }}>{authors.length} Total</span>
        </div>

        {authors.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <p className="help">The author database is currently empty.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {authors.map((a) => (
                  <div key={a.id} className="card" style={{ transition: 'transform 0.2s', cursor: 'default' }}>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {/* Foto rrethore me border të hollë */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                          src={a.foto_profili || "https://via.placeholder.com/80"}
                          alt={a.emri}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: '3px solid #f8fafc',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                          }}
                        />
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                          {a.emri} {a.mbiemri}
                        </div>
                        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                           <span>📍 {a.vendi || "Unknown Location"}</span>
                        </div>
                        <p style={{
                          fontSize: 13,
                          color: "#475569",
                          lineHeight: 1.5,
                          margin: '0 0 16px 0',
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {a.biografia || "No biography provided."}
                        </p>
                        
                        <div style={{ display: "flex", gap: 8 }}>
                          <button type="button" className="btn btnGhost" onClick={() => handleEdit(a)}>
                            Edit
                          </button>
                          <button type="button" className="btn btnGhost" onClick={() => handleDelete(a.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAuthor;