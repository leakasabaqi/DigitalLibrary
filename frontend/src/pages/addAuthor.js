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
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {author.id ? "Edit Author" : "Add New Author"}
            </div>
            <div className="cardSubtitle">
              Manage your author database with a clean, consistent admin design.
            </div>
          </div>
          <div className="help">
            {author.id
              ? "Editing an existing author"
              : "Add a new author to the collection"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="formGrid">
          <div className="field">
            <label className="label">First Name *</label>
            <input
              className="input"
              type="text"
              name="emri"
              value={author.emri || ""}
              placeholder="Enter first name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="label">Last Name *</label>
            <input
              className="input"
              type="text"
              name="mbiemri"
              value={author.mbiemri || ""}
              placeholder="Enter last name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="label">Country</label>
            <input
              className="input"
              type="text"
              name="vendi"
              value={author.vendi || ""}
              placeholder="Enter country"
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label className="label">Profile Image URL</label>
            <input
              className="input"
              type="text"
              name="foto_profili"
              value={author.foto_profili || ""}
              placeholder="Enter profile image URL"
              onChange={handleChange}
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Biography</label>
            <textarea
              className="textarea"
              name="biografia"
              value={author.biografia || ""}
              placeholder="Enter author biography"
              onChange={handleChange}
            />
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {author.id ? "Save Changes" : "Add Author"}
            </button>
            {author.id && (
              <button
                type="button"
                className="btn btnGhost"
                onClick={() =>
                  setAuthor({
                    emri: "",
                    mbiemri: "",
                    biografia: "",
                    vendi: "",
                    foto_profili: "",
                  })
                }
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <div className="cardTitle">Authors Collection</div>
            <div className="cardSubtitle">
              Browse and manage all authors in the database.
            </div>
          </div>
          <div className="help">{authors.length} authors</div>
        </div>

        {authors.length === 0 ? (
          <div className="cardTight" style={{ textAlign: "center" }}>
            <div
              className="cardTitle"
              style={{ fontSize: 18, marginBottom: 8 }}
            >
              No authors yet
            </div>
            <div className="help">
              Start building your author database by adding your first author
              above.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 18,
            }}
          >
            {authors.map((a) => (
              <div key={a.id} className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  {a.foto_profili && (
                    <img
                      src={a.foto_profili}
                      alt="Author profile"
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        objectFit: "cover",
                        boxShadow: "0 4px 12px rgba(15,23,42,0.1)",
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: 4,
                      }}
                    >
                      {a.emri} {a.mbiemri}
                    </div>
                    {a.vendi && (
                      <div className="help" style={{ color: "#475569" }}>
                        {a.vendi}
                      </div>
                    )}
                  </div>
                </div>

                {a.biografia && (
                  <p
                    style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.6,
                      marginBottom: 14,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {a.biografia}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="btn btnPrimary"
                    onClick={() => handleEdit(a)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btnDanger"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </button>
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
