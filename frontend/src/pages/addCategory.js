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
    if (await window.confirm("A dëshiron ta fshish kategorinë?")) {
      try {
        await axios.delete(`http://localhost:5000/categories/${id}`);
        fetchCategories();
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
              {category.id ? "Edit Category" : "Add New Category"}
            </div>
            <div className="cardSubtitle">
              {category.id
                ? "Update category details"
                : "Create new book categories for better organization"}
            </div>
          </div>
          <div className="help">{categories.length} categories</div>
        </div>
        <form onSubmit={handleSubmit} className="formGrid">
          <div className="field">
            <label className="label">Category Name *</label>
            <input
              name="emertimi"
              value={category.emertimi || ""}
              placeholder="Enter category name"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div className="field">
            <label className="label">Icon URL</label>
            <input
              name="ikona"
              value={category.ikona || ""}
              placeholder="Enter icon URL"
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="field">
            <label className="label">Parent Category</label>
            <select
              name="kategoria_prind_id"
              value={category.kategoria_prind_id || ""}
              onChange={handleChange}
              className="select"
            >
              <option value="">None (Main Category)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emertimi}
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Description</label>
            <textarea
              name="pershkrimi"
              value={category.pershkrimi || ""}
              placeholder="Enter category description"
              onChange={handleChange}
              className="textarea"
            />
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {category.id ? "Save Changes" : "Add Category"}
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
                className="btn btnGhost"
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
            <div className="cardTitle">Categories Collection</div>
            <div className="cardSubtitle">View and manage all categories</div>
          </div>
        </div>
        {categories.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#718096" }}
          >
            No categories yet. Create your first one above.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {categories.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: 12,
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  {c.ikona && (
                    <img
                      src={c.ikona}
                      alt="icon"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {c.emertimi}
                    </div>
                    {c.kategoria_prind_id && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#718096",
                          marginTop: 2,
                        }}
                      >
                        Subcategory
                      </div>
                    )}
                  </div>
                </div>
                {c.pershkrimi && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#4a5568",
                      lineHeight: 1.4,
                      marginBottom: 10,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {c.pershkrimi}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleEdit(c)}
                    className="btn btnGhost"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="btn btnGhost"
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

export default AddCategory;
