import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    emertimi: "",
    pershkrimi: "",
    ikona: "",
    kategoria_prind_id: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
      alert("Gabim gjatë ngarkim të kategorive!");
    }
  };

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryId = category.id || category._id;
    const isUpdate = !!categoryId;

    const url = isUpdate
      ? `http://localhost:5000/categories/${categoryId}`
      : "http://localhost:5000/categories";

    try {
      const res = await axios({
        method: isUpdate ? "put" : "post",
        url: url,
        data: category,
      });

      if (res.status === 200 || res.status === 201) {
        alert(isUpdate ? "Kategoria u përditësua!" : "Kategoria u shtua!");
        setCategory({
          emertimi: "",
          pershkrimi: "",
          ikona: "",
          kategoria_prind_id: "",
        });
        fetchCategories();
      }
    } catch (err) {
      console.error("Gabimi:", err.response);
      alert("Gabim: " + (err.response?.data || "Lidhja dështoi"));
    }
  };

  const handleEdit = (c) => {
    setCategory({ ...c });
  };

  const handleDelete = async (id) => {
    if (window.confirm("A dëshiron ta fshish kategorinë?")) {
      try {
        await axios.delete(`http://localhost:5000/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert("Gabim gjatë fshirjes!");
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#2d3748",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          🏷️ Category Management
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#718096",
            fontWeight: "400",
          }}
        >
          {category.id
            ? "Edit existing category"
            : "Create new book categories for better organization"}
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "2.5rem",
          marginBottom: "3rem",
          boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            color: "#2d3748",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {category.id ? "✏️ Edit Category" : "➕ Add New Category"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Category Name *
              </label>
              <input
                name="emertimi"
                value={category.emertimi || ""}
                placeholder="Enter category name"
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Icon URL
              </label>
              <input
                name="ikona"
                value={category.ikona || ""}
                placeholder="Enter icon URL"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Parent Category
              </label>
              <select
                name="kategoria_prind_id"
                value={category.kategoria_prind_id || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: "white",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">None (Main Category)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emertimi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Description
              </label>
              <textarea
                name="pershkrimi"
                value={category.pershkrimi || ""}
                placeholder="Enter category description"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  minHeight: "120px",
                  resize: "vertical",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <button
              type="submit"
              style={{
                padding: "1rem 2rem",
                background: category.id
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                fontSize: "1rem",
                fontWeight: "600",
                fontFamily: "'Poppins', sans-serif",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                minWidth: "160px",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 6px 20px rgba(102, 126, 234, 0.6)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.4)";
              }}
            >
              {category.id ? "💾 Save Changes" : "🏷️ Add Category"}
            </button>

            {category.id && (
              <button
                type="button"
                onClick={() =>
                  setCategory({
                    emertimi: "",
                    pershkrimi: "",
                    ikona: "",
                    kategoria_prind_id: "",
                  })
                }
                style={{
                  padding: "1rem 2rem",
                  background: "transparent",
                  color: "#718096",
                  border: "2px solid #e2e8f0",
                  borderRadius: "50px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  fontFamily: "'Poppins', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "160px",
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.color = "#667eea";
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.color = "#718096";
                }}
              >
                ❌ Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "2.5rem",
          boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            color: "#2d3748",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          📂 Categories Collection
        </h2>

        {categories.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#718096",
              background: "#f8f9fa",
              borderRadius: "12px",
              border: "2px dashed #e2e8f0",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📂</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#4a5568",
              }}
            >
              No categories yet
            </h3>
            <p style={{ fontSize: "1rem" }}>
              Start organizing your books by creating your first category above.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {categories.map((c) => (
              <div
                key={c.id}
                style={{
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  e.target.style.borderColor = "#667eea";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                  e.target.style.borderColor = "#e2e8f0";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {c.ikona && (
                    <img
                      src={c.ikona}
                      alt="Category icon"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        marginRight: "1rem",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#2d3748",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {c.emertimi}
                    </h3>
                    {c.kategoria_prind_id && (
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#718096",
                          margin: "0",
                        }}
                      >
                        Subcategory
                      </p>
                    )}
                  </div>
                </div>

                {c.pershkrimi && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#4a5568",
                      lineHeight: "1.5",
                      marginBottom: "1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {c.pershkrimi}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => handleEdit(c)}
                    style={{
                      padding: "0.5rem 1rem",
                      background:
                        "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      fontFamily: "'Poppins', sans-serif",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(72, 187, 120, 0.4)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background:
                        "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      fontFamily: "'Poppins', sans-serif",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(245, 101, 101, 0.4)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    🗑️ Delete
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

export default AddCategory;
