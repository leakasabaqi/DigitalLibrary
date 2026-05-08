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
          💎 Subscription Plans
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
          {plan.id ? "✏️ Edit Plan" : "➕ Create New Plan"}
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
                <option value="aktiv">🟢 Active</option>
                <option value="jo-aktiv">🔴 Inactive</option>
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
                Plan Description
              </label>
              <textarea
                name="pershkrimi"
                value={plan.pershkrimi || ""}
                placeholder="Describe the plan features and benefits"
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

            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  cursor: "pointer",
                }}
              >
                <input
                  name="a_ka_shkarkim"
                  type="checkbox"
                  checked={
                    plan.a_ka_shkarkim === 1 || plan.a_ka_shkarkim === "1"
                  }
                  onChange={handleChange}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#667eea",
                  }}
                />
                📥 Allow book downloads
              </label>
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
                background: plan.id
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
              {plan.id ? "💾 Save Changes" : "💎 Create Plan"}
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

      {/* Plans List Card */}
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
          📋 Subscription Plans
        </h2>

        {plans.length === 0 ? (
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
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#4a5568",
              }}
            >
              No plans yet
            </h3>
            <p style={{ fontSize: "1rem" }}>
              Create your first subscription plan to start offering library
              services.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {plans.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
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
                {/* Status Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    background:
                      p.statusi === "aktiv"
                        ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                        : "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
                    color: "white",
                  }}
                >
                  {p.statusi === "aktiv" ? "🟢 Active" : "🔴 Inactive"}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      marginRight: "1rem",
                    }}
                  >
                    💎
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#2d3748",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {p.emertimi}
                    </h3>
                    <p
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#667eea",
                        margin: "0",
                      }}
                    >
                      €{p.cmimi_mujor}/month
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>📚</span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#4a5568",
                      }}
                    >
                      Up to {p.librat_max_mujor} books per month
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>
                      {p.a_ka_shkarkim === 1 || p.a_ka_shkarkim === "1"
                        ? "📥"
                        : "👁️"}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#4a5568",
                      }}
                    >
                      {p.a_ka_shkarkim === 1 || p.a_ka_shkarkim === "1"
                        ? "Download enabled"
                        : "Read-only access"}
                    </span>
                  </div>
                </div>

                {p.pershkrimi && (
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
                    {p.pershkrimi}
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
                    onClick={() => handleEdit(p)}
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
                    onClick={() => handleDelete(p.id)}
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

export default AddPlan;
