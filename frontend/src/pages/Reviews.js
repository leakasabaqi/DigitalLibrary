import React, { useState, useEffect } from "react";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [record, setRecord] = useState({
    perdoruesi_id: "",
    libri_id: "",
    vleresimi: 5,
    komenti: "",
  });

  const fetchData = async () => {
    try {
      const [resR, resU, resB] = await Promise.all([
        axios.get("http://localhost:5000/reviews"),
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/books"),
      ]);
      setReviews(resR.data || []);
      setUsers(resU.data || []);
      setBooks(resB.data || []);
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

  const handleRating = (value) => {
    setRecord((prev) => ({ ...prev, vleresimi: value }));
  };

  const handleEdit = (review) => {
    setRecord({
      perdoruesi_id: review.perdoruesi_id,
      libri_id: review.libri_id,
      vleresimi: review.vleresimi,
      komenti: review.komenti || "",
      id: review.id,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setRecord({ perdoruesi_id: "", libri_id: "", vleresimi: 5, komenti: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!record.perdoruesi_id || !record.libri_id) {
      return alert("Ju lutem zgjidhni Përdoruesin dhe Librin!");
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/reviews/${record.id}`, record);
      } else {
        await axios.post("http://localhost:5000/reviews", record);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert("Gabim gjatë ruajtjes!");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "'Poppins', sans-serif",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    outline: "none",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#667eea";
    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "none";
  };

  const ratingButton = (value) => ({
    fontSize: "24px",
    cursor: "pointer",
    color: value <= record.vleresimi ? "#facc15" : "#cbd5e1",
    background: "none",
    border: "none",
    padding: "0 6px",
  });

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {isEditing ? "Edit Review" : "Add New Review"}
            </div>
            <div className="cardSubtitle">
              Add, edit, and manage book reviews with a polished admin design.
            </div>
          </div>
          <div className="help">
            {isEditing
              ? "Updating an existing review"
              : "Create a new book review"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="formGrid">
          <div className="field">
            <label className="label">User *</label>
            <select
              className="select"
              name="perdoruesi_id"
              value={record.perdoruesi_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Select User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.emri} {u.mbiemri}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Book *</label>
            <select
              className="select"
              name="libri_id"
              value={record.libri_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Book --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.titulli}
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Rating</label>
            <div
              style={{
                padding: 14,
                borderRadius: 14,
                background: "#f8fafc",
                border: "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRating(value)}
                    style={ratingButton(value)}
                  >
                    ★
                  </button>
                ))}
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  {record.vleresimi}/5
                </span>
              </div>
            </div>
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Comment</label>
            <textarea
              className="textarea"
              name="komenti"
              value={record.komenti}
              onChange={handleChange}
              rows={5}
              placeholder="Write the review comment here..."
            />
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {isEditing ? "Save Review" : "Add Review"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btnGhost"
                onClick={resetForm}
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
            <div className="cardTitle">Reviews</div>
            <div className="cardSubtitle">
              Browse all book reviews and manage published feedback.
            </div>
          </div>
          <div className="help">{reviews.length} reviews</div>
        </div>

        {reviews.length === 0 ? (
          <div className="cardTight" style={{ textAlign: "center" }}>
            <div
              className="cardTitle"
              style={{ fontSize: 18, marginBottom: 8 }}
            >
              No reviews available yet
            </div>
            <div className="help">
              Add a review above to populate this list.
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
            {reviews.map((r) => (
              <div key={r.id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: 6,
                      }}
                    >
                      {r.titulli}
                    </div>
                    <div className="help">
                      {r.emri} {r.mbiemri}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btnGhost"
                      onClick={() => handleEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btnGhost"
                      onClick={async () => {
                        if (window.confirm("Delete this review?")) {
                          await axios.delete(
                            `http://localhost:5000/reviews/${r.id}`,
                          );
                          fetchData();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  <span className="badge badgeAccent">
                    Rating: {r.vleresimi}/5
                  </span>
                  <span className="help" style={{ color: "#475569" }}>
                    {r.komenti
                      ? `${r.komenti.substring(0, 40)}${r.komenti.length > 40 ? "..." : ""}`
                      : "No comment available."}
                  </span>
                </div>

                <p
                  style={{
                    color: "#475569",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {r.komenti || "No comment available."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
