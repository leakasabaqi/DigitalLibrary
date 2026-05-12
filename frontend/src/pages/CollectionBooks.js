import React, { useState, useEffect } from "react";
import axios from "axios";

const CollectionBooks = () => {
  const [list, setList] = useState([]);
  const [collections, setCollections] = useState([]);
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState({ koleksioni_id: "", libri_id: "" });

  const fetchData = async () => {
    try {
      const [resCB, resC, resB] = await Promise.all([
        axios.get("http://localhost:5000/collection-books"),
        axios.get("http://localhost:5000/collections"),
        axios.get("http://localhost:5000/books"),
      ]);
      setList(resCB.data || []);
      setCollections(resC.data || []);
      setBooks(resB.data || []);
    } catch (err) {
      console.error("Gabim gjatë ngarkimit të të dhënave:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setRecord({ koleksioni_id: "", libri_id: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/collection-books/${record.id}`,
          record,
        );
      } else {
        await axios.post("http://localhost:5000/collection-books", record);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Gabim gjatë ruajtjes së të dhënave!");
    }
  };

  const handleEdit = (item) => {
    setRecord(item);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {isEditing ? "Edit Collection Book" : "Add Book to Collection"}
            </div>
            <div className="cardSubtitle">
              Assign books to collections using a clean interface.
            </div>
          </div>
          <div className="help">{list.length} assignments</div>
        </div>

        <form onSubmit={handleSubmit} className="formGrid" style={{ gap: 18 }}>
          <div className="field">
            <label className="label">Collection</label>
            <select
              className="select"
              name="koleksioni_id"
              value={record.koleksioni_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Collection --</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emertimi} (nga {c.emri} {c.mbiemri})
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
            <button
              type="submit"
              className={isEditing ? "btn btnPrimary" : "btn btnAccent"}
            >
              {isEditing ? "Save Changes" : "Add to Collection"}
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
            <div className="cardTitle">Collection Books</div>
            <div className="cardSubtitle">
              Current assignments of books to collections.
            </div>
          </div>
        </div>

        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Collection</th>
                <th className="th">Created by</th>
                <th className="th">Book</th>
                <th className="th" style={{ textAlign: "center" }}>
                  Added date
                </th>
                <th className="th" style={{ textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? (
                list.map((item) => (
                  <tr key={item.id}>
                    <td className="td">{item.koleksioni}</td>
                    <td className="td">
                      {item.pronari_emri} {item.pronari_mbiemri}
                    </td>
                    <td className="td">{item.libri}</td>
                    <td
                      className="td"
                      style={{ textAlign: "center", color: "#64748b" }}
                    >
                      {new Date(item.data_shtimit).toLocaleDateString()}
                    </td>
                    <td className="td" style={{ textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          className="btn btnGhost"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btnDanger"
                          onClick={async () => {
                            if (
                              window.confirm(
                                "A jeni të sigurt që dëshironi ta hiqni këtë libër nga koleksioni?",
                              )
                            ) {
                              await axios.delete(
                                `http://localhost:5000/collection-books/${item.id}`,
                              );
                              fetchData();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="td"
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: 24,
                      color: "#94a3b8",
                    }}
                  >
                    No books assigned to collections yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollectionBooks;
