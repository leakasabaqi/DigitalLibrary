import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPlan = () => {
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState({
    emertimi: "",
    pershkrimi: "",
    cmimi_mujor: "",
    librat_max_mujor: "",
    a_ka_shkarkim: 0,
    statusi: "aktiv",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:5000/plans");
      setPlans(res.data);
    } catch (err) {
      console.log(err);
      alert("Gabim gjatë ngarkim të planeve!");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlan({
      ...plan,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUpdate = plan.id ? true : false;
    const url = isUpdate
      ? `http://localhost:5000/plans/${plan.id}`
      : "http://localhost:5000/plans";

    try {
      let response;
      if (isUpdate) {
        // Përdorim axios.put në vend të fetch
        response = await axios.put(url, plan);
      } else {
        // Përdorim axios.post
        response = await axios.post(url, plan);
      }

      alert(isUpdate ? "Plani u përditësua!" : "Plani u shtua!");
      setPlan({
        emertimi: "",
        pershkrimi: "",
        cmimi_mujor: "",
        librat_max_mujor: "",
        a_ka_shkarkim: 0,
        statusi: "aktiv",
      });
      fetchPlans();
    } catch (err) {
      console.error("Gabimi:", err.response || err);
      alert(
        "Gabim nga serveri: " + (err.response?.data || "Nuk u arrit lidhja"),
      );
    }
  };

  const handleEdit = (p) => {
    setPlan({ ...p });
  };

  const handleDelete = async (id) => {
    if (window.confirm("A dëshiron ta fshish planin?")) {
      try {
        await axios.delete(`http://localhost:5000/plans/${id}`);
        fetchPlans();
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
          Subscription Plans
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#718096",
            fontWeight: "400",
          }}
        >
          {plan.id
            ? "Edit existing subscription plan"
            : "Create new subscription plans for your library"}
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
          {plan.id ? "Edit Plan" : "Create New Plan"}
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
                Plan Name *
              </label>
              <input
                name="emertimi"
                value={plan.emertimi || ""}
                placeholder="Enter plan name (e.g. Premium)"
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
                Monthly Price (€) *
              </label>
              <input
                name="cmimi_mujor"
                type="number"
                step="0.01"
                value={plan.cmimi_mujor || ""}
                placeholder="Enter monthly price"
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
                Max Books per Month *
              </label>
              <input
                name="librat_max_mujor"
                type="number"
                value={plan.librat_max_mujor || ""}
                placeholder="Enter book limit"
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
                Plan Status
              </label>
              <select
                name="statusi"
                value={plan.statusi || "aktiv"}
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
                <option value="aktiv">Active</option>
                <option value="jo-aktiv">Inactive</option>
              </select>
            </div>
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Plan Description</label>
            <textarea
              name="pershkrimi"
              value={plan.pershkrimi || ""}
              placeholder="Describe the plan features and benefits"
              onChange={handleChange}
              className="textarea"
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              <input
                name="a_ka_shkarkim"
                type="checkbox"
                checked={plan.a_ka_shkarkim === 1 || plan.a_ka_shkarkim === "1"}
                onChange={handleChange}
                style={{ accentColor: "#2563eb", width: 18, height: 18 }}
              />
              Allow book downloads
            </label>
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {plan.id ? "Save Changes" : "Create Plan"}
            </button>
            {plan.id && (
              <button
                type="button"
                onClick={() =>
                  setPlan({
                    emertimi: "",
                    pershkrimi: "",
                    cmimi_mujor: "",
                    librat_max_mujor: "",
                    a_ka_shkarkim: 0,
                    statusi: "aktiv",
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
            <div className="cardTitle">Subscription Plans</div>
            <div className="cardSubtitle">View and manage all plans</div>
          </div>
        </div>
        {plans.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#718096" }}
          >
            No plans yet. Create your first plan above.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {plans.map((p) => (
              <div
                key={p.id}
                style={{
                  padding: 12,
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    background: p.statusi === "aktiv" ? "#dcfce7" : "#fee2e2",
                    color: p.statusi === "aktiv" ? "#15803d" : "#991b1b",
                  }}
                >
                  {p.statusi === "aktiv" ? "Active" : "Inactive"}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                    marginTop: 5,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    €
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {p.emertimi}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#2563eb",
                        fontWeight: 600,
                      }}
                    >
                      €{p.cmimi_mujor}/month
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#4a5568",
                    marginBottom: 8,
                  }}
                >
                  <div>Up to {p.librat_max_mujor} books/month</div>
                  <div>
                    {p.a_ka_shkarkim === 1 || p.a_ka_shkarkim === "1"
                      ? "✓ Download"
                      : "• Read-only"}
                  </div>
                </div>
                {p.pershkrimi && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#4a5568",
                      marginBottom: 10,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.pershkrimi}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleEdit(p)}
                    className="btn btnPrimary"
                    style={{
                      flex: 1,
                      fontSize: "0.85rem",
                      padding: "6px 10px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="btn btnDanger"
                    style={{
                      flex: 1,
                      fontSize: "0.85rem",
                      padding: "6px 10px",
                    }}
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

export default AddPlan;
