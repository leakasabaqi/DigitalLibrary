import { useState, useEffect, useRef } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";

const accent = "#2563eb";

function getToday() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getDaysLeft(expiry) {
  if (!expiry) return null;
  const now = new Date();
  const end = new Date(expiry);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : 0;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UserSubscriptions() {
  const userRef = useRef(JSON.parse(localStorage.getItem("user")));
  const user = userRef.current;
  const [plans, setPlans] = useState([]);
  const [mySub, setMySub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      axios.get("http://localhost:5000/plans"),
      axios.get(`http://localhost:5000/subscriptions?perdoruesi_id=${user.id}`),
    ])
      .then(([resPlans, resSub]) => {
        setPlans(Array.isArray(resPlans.data) ? resPlans.data.filter((p) => p.statusi === "aktiv") : []);
        const subs = Array.isArray(resSub.data) ? resSub.data : [];
        const active = subs.find((s) => s.statusi === "aktiv");
        setMySub(active || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (plan) => {
    if (!window.confirm(`Subscribe to "${plan.emertimi}" for €${plan.cmimi_mujor}/month?`)) return;
    setSubscribing(plan.id);
    try {
      const startDate = getToday();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      const expiry = endDate.toISOString().split("T")[0];

      const res = await axios.post("http://localhost:5000/subscriptions", {
        perdoruesi_id: user.id,
        plani_id: plan.id,
        data_fillimit: startDate,
        data_skadimit: expiry,
        statusi: "aktiv",
        pagesa_automatike: 0,
      });

      setMySub(res.data);
      alert(`Successfully subscribed to "${plan.emertimi}"!`);
    } catch (err) {
      alert("Subscription failed: " + (err.response?.data || "Server error"));
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel your current subscription?")) return;
    try {
      await axios.delete(`http://localhost:5000/subscriptions/${mySub.id}`);
      setMySub(null);
      alert("Subscription cancelled.");
    } catch (err) {
      alert("Error cancelling subscription.");
    }
  };

  const isSubscribedTo = (planId) => mySub && Number(mySub.plani_id) === Number(planId);

  return (
    <UserLayout
      pageTitle="Subscription Plans"
      pageSubtitle="Choose the plan that fits your reading habits"
    >
      <div style={{ padding: 18 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#64748b", fontWeight: 600 }}>
            Loading plans...
          </div>
        ) : (
          <>
            {mySub && (
              <div
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  borderRadius: 16,
                  padding: "20px 24px",
                  marginBottom: 32,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, opacity: 0.8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Current Plan
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>
                    {plans.find((p) => Number(p.id) === Number(mySub.plani_id))?.emertimi || "Active Plan"}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
                    {getDaysLeft(mySub.data_skadimit) > 0
                      ? `${getDaysLeft(mySub.data_skadimit)} days remaining (until ${formatDate(mySub.data_skadimit)})`
                      : "Expired"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "10px 18px",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "background .12s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                >
                  Cancel Subscription
                </button>
              </div>
            )}

            {plans.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#64748b", fontWeight: 600 }}>
                No subscription plans available yet.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 20,
                }}
              >
                {plans.map((plan, idx) => {
                  const owned = isSubscribedTo(plan.id);
                  const isPopular = idx === 1 && plans.length >= 3;
                  return (
                    <div
                      key={plan.id}
                      style={{
                        background: "#fff",
                        border: owned
                          ? `2px solid ${accent}`
                          : isPopular
                          ? `2px solid ${accent}`
                          : "1px solid rgba(15,23,42,0.10)",
                        borderRadius: 16,
                        padding: 0,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: owned
                          ? "0 8px 30px rgba(37,99,235,0.15)"
                          : isPopular
                          ? "0 8px 30px rgba(37,99,235,0.12)"
                          : "0 4px 16px rgba(15,23,42,0.06)",
                        transition: "transform .15s ease, box-shadow .15s ease",
                      }}

                    >
                      {isPopular && !owned && (
                        <div
                          style={{
                            background: accent,
                            color: "#fff",
                            textAlign: "center",
                            fontSize: 11,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            padding: "6px 0",
                          }}
                        >
                          Most Popular
                        </div>
                      )}

                      <div style={{ padding: "24px 24px 0" }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            color: "#64748b",
                            marginBottom: 4,
                          }}
                        >
                          {plan.emertimi}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 4,
                            marginBottom: 16,
                          }}
                        >
                          <span style={{ fontSize: 32, fontWeight: 900, color: "#0f172a" }}>
                            €{plan.cmimi_mujor}
                          </span>
                          <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>
                            /month
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            color: "#475569",
                            lineHeight: 1.5,
                            marginBottom: 20,
                            minHeight: 40,
                          }}
                        >
                          {plan.pershkrimi || "No description"}
                        </div>

                        <div
                          style={{
                            borderTop: "1px solid rgba(15,23,42,0.06)",
                            padding: "16px 0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 10,
                              fontSize: 14,
                              color: "#334155",
                              fontWeight: 500,
                            }}
                          >
                            <span style={{ color: "#16a34a", fontWeight: 900 }}>✓</span>
                            {Number(plan.librat_max_mujor) === -1 ? "Unlimited books" : `Up to ${plan.librat_max_mujor} books / month`}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              fontSize: 14,
                              color: "#334155",
                              fontWeight: 500,
                            }}
                          >
                            <span style={{ color: plan.a_ka_shkarkim === 1 || plan.a_ka_shkarkim === "1" ? "#16a34a" : "#94a3b8", fontWeight: 900 }}>
                              {plan.a_ka_shkarkim === 1 || plan.a_ka_shkarkim === "1" ? "✓" : "—"}
                            </span>
                            Download books
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: "0 24px 24px" }}>
                        {owned ? (
                          <div
                            style={{
                              width: "100%",
                              textAlign: "center",
                              background: "rgba(37,99,235,0.08)",
                              border: `1px solid rgba(37,99,235,0.2)`,
                              color: accent,
                              borderRadius: 10,
                              padding: "12px 0",
                              fontWeight: 700,
                              fontSize: 14,
                              fontFamily: "inherit",
                            }}
                          >
                            Current Plan
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={subscribing === plan.id}
                            onClick={() => handleSubscribe(plan)}
                            style={{
                              width: "100%",
                              background: isPopular ? accent : "#fff",
                              border: isPopular
                                ? `1px solid ${accent}`
                                : "1px solid rgba(15,23,42,0.18)",
                              color: isPopular ? "#fff" : "#0f172a",
                              borderRadius: 10,
                              padding: "12px 0",
                              fontWeight: 700,
                              fontSize: 14,
                              cursor: subscribing === plan.id ? "not-allowed" : "pointer",
                              fontFamily: "inherit",
                              transition: "all .12s ease",
                              opacity: subscribing === plan.id ? 0.6 : 1,
                            }}

                          >
                            {subscribing === plan.id ? "Subscribing..." : "Subscribe"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </UserLayout>
  );
}
