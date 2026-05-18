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
  const [expandedId, setExpandedId] = useState(null);
  const [bookCounts, setBookCounts] = useState({});
  const [collectionBooks, setCollectionBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [justCreated, setJustCreated] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = () => {
    axios.get("http://localhost:5000/collections").then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setCollections(data.filter((c) => Number(c.perdoruesi_id) === Number(user.id)));
      setLoading(false);
    });
    axios.get("http://localhost:5000/collection-books").then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      const counts = {};
      data.forEach((cb) => {
        counts[cb.koleksioni_id] = (counts[cb.koleksioni_id] || 0) + 1;
      });
      setBookCounts(counts);
    });
  };

  const refresh = () => {
    loadData();
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
      axios.post("http://localhost:5000/collections", payload).then((res) => {
        const newId = res.data.id;
        setForm({ emertimi: "", pershkrimi: "", a_eshte_publike: 0 });
        setShowForm(false);
        refresh();
        setExpandedId(newId);
        setJustCreated(newId);
        setTimeout(() => setJustCreated(null), 3000);
        loadCollectionBooks(newId);
      });
    }
  };

  const startEdit = (c) => {
    setEditing(c);
    setForm({ emertimi: c.emertimi, pershkrimi: c.pershkrimi || "", a_eshte_publike: c.a_eshte_publike });
    setShowForm(true);
    setExpandedId(null);
  };

  const handleDelete = async (id) => {
    if (!await window.confirm("Delete this collection?")) return;
    axios.delete(`http://localhost:5000/collections/${id}`).then(() => {
      if (expandedId === id) {
        setExpandedId(null);
        setCollectionBooks([]);
      }
      refresh();
    });
  };

  const loadCollectionBooks = (id) => {
    axios.get(`http://localhost:5000/collections/${id}/books`).then((res) => {
      setCollectionBooks(Array.isArray(res.data) ? res.data : []);
    });
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setCollectionBooks([]);
      setSearchQuery("");
      setSearchResults([]);
    } else {
      setExpandedId(id);
      loadCollectionBooks(id);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim() || !expandedId) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setSearching(true);
      axios.get(`http://localhost:5000/books/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => {
          const books = Array.isArray(res.data) ? res.data : [];
          const existing = new Set(collectionBooks.map((b) => b.libri_id));
          setSearchResults(books.filter((b) => !existing.has(b.id)));
          setSearching(false);
        })
        .catch(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, expandedId, collectionBooks]);

  const addBookToCollection = (collectionId, bookId) => {
    axios.post("http://localhost:5000/collection-books", {
      koleksioni_id: collectionId,
      libri_id: bookId,
    }).then(() => {
      loadCollectionBooks(collectionId);
      axios.get("http://localhost:5000/collection-books").then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const counts = {};
        data.forEach((cb) => {
          counts[cb.koleksioni_id] = (counts[cb.koleksioni_id] || 0) + 1;
        });
        setBookCounts(counts);
      });
    });
  };

  const removeBookFromCollection = (cbId, collectionId) => {
    axios.delete(`http://localhost:5000/collection-books/${cbId}`).then(() => {
      loadCollectionBooks(collectionId);
      axios.get("http://localhost:5000/collection-books").then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const counts = {};
        data.forEach((cb) => {
          counts[cb.koleksioni_id] = (counts[cb.koleksioni_id] || 0) + 1;
        });
        setBookCounts(counts);
      });
    });
  };

  return (
    <UserLayout pageTitle="My Collections" pageSubtitle="Organize books into collections">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>Loading...</div>
      ) : (
        <>
          <div style={{ marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => { setShowForm((p) => !p); if (!showForm) { setEditing(null); setForm({ emertimi: "", pershkrimi: "", a_eshte_publike: 0 }); setExpandedId(null); } }}
              style={{
                padding: "12px 24px", borderRadius: 12, border: "none",
                background: "#2563eb",
                color: "#fff", fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit", transition: "all .12s ease",
              }}
            >
              + New Collection
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
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" style={{
                  padding: "11px 24px", borderRadius: 12, border: "none",
                  background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  {editing ? "Update" : "Save"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm({ emertimi: "", pershkrimi: "", a_eshte_publike: 0 }); }} style={{
                  padding: "11px 24px", borderRadius: 12, border: `1px solid ${borderColor}`,
                  background: "transparent", color: "#334155", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {collections.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No collections yet</div>
              <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>Create a collection to organize your books.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {collections.map((c) => {
                const count = bookCounts[c.id] || 0;
                const isExpanded = expandedId === c.id;
                return (
                  <div key={c.id} style={{
                    background: "#fff", borderRadius: 18, border: `1px solid ${borderColor}`,
                    borderLeft: `6px solid ${c.a_eshte_publike ? "#2563eb" : "#94a3b8"}`,
                    boxShadow: justCreated === c.id
                      ? "0 0 0 3px rgba(37,99,235,0.25), 0 8px 30px rgba(15,23,42,0.06)"
                      : "0 8px 30px rgba(15,23,42,0.06)",
                    overflow: "hidden",
                    transition: "box-shadow .3s ease",
                  }}>
                    <div style={{
                      padding: 20,
                      display: "flex", alignItems: "center", gap: 16,
                      cursor: "pointer",
                    }}
                      onClick={() => toggleExpand(c.id)}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 2 }}>
                          {c.emertimi}
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{
                            padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                            background: c.a_eshte_publike ? "rgba(37,99,235,0.10)" : "rgba(148,163,184,0.10)",
                            color: c.a_eshte_publike ? "#2563eb" : "#64748b",
                          }}>
                            {c.a_eshte_publike ? "Public" : "Private"}
                          </span>
                          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                            {count} {count === 1 ? "book" : "books"}
                          </span>
                        </div>
                        {c.pershkrimi && !isExpanded && (
                          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{c.pershkrimi}</div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                        {!isExpanded && (
                          <button onClick={() => toggleExpand(c.id)} style={{
                            padding: "8px 14px", borderRadius: 10, border: "none",
                            background: "rgba(37,99,235,0.10)",
                            color: "#2563eb", fontWeight: 700, fontSize: 12,
                            cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                          }}>
                            + Add Books
                          </button>
                        )}
                        <button onClick={() => startEdit(c)} style={{
                          padding: "8px 14px", borderRadius: 10, border: `1px solid ${borderColor}`,
                          background: "transparent", color: "#334155", fontWeight: 700, fontSize: 12,
                          cursor: "pointer", fontFamily: "inherit",
                        }}>Edit</button>
                        <button onClick={() => handleDelete(c.id)} style={{
                          padding: "8px 14px", borderRadius: 10, border: `1px solid ${borderColor}`,
                          background: "transparent", color: "#dc2626", fontWeight: 700, fontSize: 12,
                          cursor: "pointer", fontFamily: "inherit",
                        }}>Delete</button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: `1px solid ${borderColor}`, padding: 20 }}>
                        {c.pershkrimi && (
                          <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{c.pershkrimi}</div>
                        )}

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#334155", marginBottom: 8 }}>Add books to this collection</div>
                          <div style={{
                            display: "flex", gap: 10, alignItems: "center",
                            background: "#f8fafc", border: `1px solid ${borderColor}`,
                            borderRadius: 10, padding: "6px 12px",
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search books by title or author..."
                              style={{
                                flex: 1, border: "none", outline: "none",
                                fontSize: 13, fontWeight: 600, color: "#0f172a",
                                background: "transparent", fontFamily: "inherit",
                              }}
                            />
                            {searching && <span style={{ fontSize: 11, color: "#94a3b8" }}>Searching...</span>}
                          </div>
                        </div>

                        {searchQuery.trim() && (
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 600, fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
                              Search results {searchResults.length > 0 && `(${searchResults.length})`}
                            </div>
                            {searchResults.length === 0 && !searching ? (
                              <div style={{ fontSize: 12, color: "#94a3b8", padding: "8px 0" }}>No books found.</div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                {searchResults.map((b) => (
                                  <div key={b.id} style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "8px 10px", borderRadius: 10, background: "#f8fafc",
                                  }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{b.titulli}</div>
                                      {b.autor_emri && (
                                        <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                                          {b.autor_emri} {b.autor_mbiemri}
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => addBookToCollection(c.id, b.id)}
                                      style={{
                                        padding: "6px 12px", borderRadius: 8, border: "none",
                                        background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 11,
                                        cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                                      }}
                                    >
                                      + Add
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
                            Books in this collection ({collectionBooks.length})
                          </div>
                          {collectionBooks.length === 0 ? (
                            <div style={{ fontSize: 12, color: "#94a3b8", padding: "8px 0" }}>
                              No books yet. Search above to add books.
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {collectionBooks.map((b) => (
                                <div key={b.id} style={{
                                  display: "flex", alignItems: "center", gap: 10,
                                  padding: "8px 10px", borderRadius: 10,
                                  background: "#f8fafc",
                                }}>
                                  {b.foto_kopertines ? (
                                    <img src={b.foto_kopertines} alt={b.titulli}
                                      style={{ width: 32, height: 44, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
                                  ) : (
                                    <div style={{ width: 32, height: 44, borderRadius: 4, background: "#e2e8f0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>No<br />Cover</div>
                                  )}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{b.titulli}</div>
                                    {b.autor_emri && (
                                      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                                        {b.autor_emri} {b.autor_mbiemri}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeBookFromCollection(b.id, c.id)}
                                    style={{
                                      padding: "6px 10px", borderRadius: 8, border: "none",
                                      background: "rgba(220,38,38,0.10)", color: "#dc2626",
                                      fontWeight: 700, fontSize: 11,
                                      cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
