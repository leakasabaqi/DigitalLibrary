import React, { useEffect, useState } from "react";
import axios from "axios";

const AddBook = () => {
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    titulli: "",
    autori_id: "",
    kategoria_id: "",
    isbn: "",
    viti_botimit: "",
    gjuha: "",
    numri_faqeve: "",
    foto_kopertines: "",
    description: "",
  });

  useEffect(() => {
    fetchAuthors();
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.error("Error categories:", err));
  };

  const fetchAuthors = () => {
    fetch("http://localhost:5000/authors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAuthors(data);
        else setAuthors([]);
      })
      .catch((error) => console.error("Error authors:", error));
  };

  const fetchBooks = () => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBooks(data);
        else setBooks([]);
      })
      .catch((error) => console.error("Error books:", error));
  };

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...book,
      autori_id: parseInt(book.autori_id),
      kategoria_id: parseInt(book.kategoria_id),
      viti_botimit: parseInt(book.viti_botimit),
      numri_faqeve: parseInt(book.numri_faqeve),
    };

    const isUpdate = book.id ? true : false;
    const url = isUpdate
      ? `http://localhost:5000/books/${book.id}`
      : "http://localhost:5000/books";

    try {
      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert(isUpdate ? "Libri u përditësua!" : "Libri u shtua!");
        setBook({
          titulli: "",
          autori_id: "",
          kategoria_id: "",
          isbn: "",
          viti_botimit: "",
          gjuha: "",
          numri_faqeve: "",
          foto_kopertines: "",
          description: "",
        });
        fetchBooks();
      } else {
        const errorMsg = await response.text();
        alert("Gabim: " + errorMsg);
      }
    } catch (err) {
      alert("Gabim lidhjeje me serverin!");
    }
  };

  const handleDelete = async (id) => {
    if (await window.confirm("A dëshiron ta fshish librin?")) {
      try {
        await axios.delete(`http://localhost:5000/books/${id}`);
        fetchBooks();
      } catch (err) {
        alert("Gabim gjatë fshirjes!");
      }
    }
  };

  const handleEdit = (b) => {
    setBook({ ...b });
  };

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {book.id ? "Edit Book" : "Add New Book"}
            </div>
            <div className="cardSubtitle">
              Manage your library catalog with a clean, consistent admin design.
            </div>
          </div>
          <div className="help">
            {book.id ? "Editing an existing book" : "Add a new book"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="formGrid">
          {/* Cover Preview on top of all fields */}
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 140,
                height: 200,
                maxWidth: '100%',
                borderRadius: 12,
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '2px dashed #cbd5e1'
              }}>
                {book.foto_kopertines ? (
                  <img src={book.foto_kopertines} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: 10 }}>No Cover<br/>Preview</span>
                )}
              </div>
              <label className="label">Cover Preview</label>
            </div>
          </div>

          <div className="field">
            <label className="label">Book Title *</label>
            <input
              className="input"
              name="titulli"
              value={book.titulli || ""}
              placeholder="Enter title"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="label">Author *</label>
            <select
              className="select"
              name="autori_id"
              value={book.autori_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.emri} {a.mbiemri}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Category *</label>
            <select
              className="select"
              name="kategoria_id"
              value={book.kategoria_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emertimi || c.emri_kategorise}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Cover Image URL</label>
            <input
              className="input"
              name="foto_kopertines"
              value={book.foto_kopertines || ""}
              placeholder="https://image-link.com"
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label className="label">ISBN</label>
            <input
              className="input"
              name="isbn"
              value={book.isbn || ""}
              placeholder="ISBN"
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label className="label">Publication Year</label>
            <input
              className="input"
              name="viti_botimit"
              type="number"
              value={book.viti_botimit || ""}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label className="label">Language</label>
            <input
              className="input"
              name="gjuha"
              value={book.gjuha || ""}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label className="label">Page Count</label>
            <input
              className="input"
              name="numri_faqeve"
              type="number"
              value={book.numri_faqeve || ""}
              placeholder="Total pages"
              onChange={handleChange}
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Description</label>
            <textarea
              className="textarea"
              name="description"
              value={book.description || ""}
              placeholder="Brief description of the book"
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {book.id ? "Save Changes" : "Add Book"}
            </button>
            {book.id && (
              <button
                type="button"
                className="btn btnGhost"
                onClick={() =>
                  setBook({
                    titulli: "",
                    autori_id: "",
                    kategoria_id: "",
                    isbn: "",
                    viti_botimit: "",
                    gjuha: "",
                    numri_faqeve: "",
                    foto_kopertines: "",
                    description: "",
                  })
                }
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Collection List with Images */}
      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <div className="cardTitle">Library Collection</div>
            <div className="cardSubtitle">Browse and manage all books.</div>
          </div>
          <div className="help">{books.length} books</div>
        </div>

        {books.length === 0 ? (
          <div className="cardTight" style={{ textAlign: "center" }}>
            <div
              className="cardTitle"
              style={{ fontSize: 18, marginBottom: 8 }}
            >
              No books yet
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {books.map((b) => (
              <div key={b.id} className="card" style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 6,
                        }}
                      >
                        {b.titulli}
                      </div>
                      <div className="help">
                        Author: {b.autor_emri || "Unknown"} {b.autor_mbiemri || ""}
                      </div>
                      <div className="help">ISBN: {b.isbn || "N/A"}</div>
                      {b.description && (
                        <div style={{ color: "#64748b", fontSize: 12, lineHeight: 1.6, marginTop: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {b.description}
                        </div>
                      )}
                    </div>
                    {/* Book Cover displayed in the card */}
                    <img
                      src={
                        b.foto_kopertines ||
                        "https://via.placeholder.com/72x96?text=No+Cover"
                      }
                      alt="Cover"
                      style={{
                        width: 72,
                        height: 96,
                        objectFit: "cover",
                        borderRadius: 12,
                        boxShadow: "0 4px 18px rgba(15,23,42,0.08)",
                      }}
                    />
                  </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                  }}
                >
                  <button
                    type="button"
                    className="btn btnGhost"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btnGhost"
                    onClick={() => handleDelete(b.id)}
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

export default AddBook;
