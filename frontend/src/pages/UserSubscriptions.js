import { useState, useEffect, useRef } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";
import { showToast } from "../components/Toast";

const accent = "#2563eb";

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

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + " / " + digits.slice(2);
  }
  return digits;
}

export default function UserSubscriptions() {
  const userRef = useRef(JSON.parse(localStorage.getItem("user")));
  const user = userRef.current;
  const [plans, setPlans] = useState([]);
  const [mySub, setMySub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

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

  const openPayment = (plan) => {
    setSelectedPlan(plan);
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setShowModal(true);
  };

  const handlePay = async () => {
    if (!cardName.trim() || cardNumber.replace(/\s/g, "").length < 13 || cardExpiry.replace(/\s/g, "").length < 4 || cardCvv.length < 3) {
      showToast("Please fill in all card details correctly.", "error");
      return;
    }
    if (!await window.confirm(`Confirm payment of €${selectedPlan.cmimi_mujor} for "${selectedPlan.emertimi}"?`)) return;
    setPaying(true);
    try {
      const res = await axios.post("http://localhost:5000/api/payments", {
        perdoruesi_id: user.id,
        plani_id: selectedPlan.id,
        cmimi_mujor: selectedPlan.cmimi_mujor,
        card_number: cardNumber.replace(/\s/g, ""),
        expiry: cardExpiry.replace(/\s/g, ""),
        cvv: cardCvv,
        cardholder_name: cardName,
      });
      setMySub(res.data);
      setShowModal(false);
      showToast(`Payment successful! You are now subscribed to "${selectedPlan.emertimi}".`, "success");
    } catch (err) {
      showToast("Payment failed: " + (err.response?.data || "Server error"), "error");
    } finally {
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    if (!await window.confirm("Cancel your current subscription?")) return;
    try {
      await axios.delete(`http://localhost:5000/subscriptions/${mySub.id}`);
      setMySub(null);
      alert("Subscription cancelled.");
    } catch (err) {
      alert("Error cancelling subscription.");
    }
  };

  const isSubscribedTo = (planId) => mySub && Number(mySub.plani_id) === Number(planId);

  const lastFour = cardNumber.replace(/\s/g, "").slice(-4) || "••••";
  const displayBrand = cardNumber.startsWith("4") ? "VISA" : cardNumber.startsWith("5") ? "MASTERCARD" : "";

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
                  }}
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
                              border: "1px solid rgba(37,99,235,0.2)",
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
                            onClick={() => openPayment(plan)}
                            style={{
                              width: "100%",
                              background: isPopular ? accent : "#fff",
                              border: isPopular
                                ? "1px solid " + accent
                                : "1px solid rgba(15,23,42,0.18)",
                              color: isPopular ? "#fff" : "#0f172a",
                              borderRadius: 10,
                              padding: "12px 0",
                              fontWeight: 700,
                              fontSize: 14,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            Subscribe
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

      {/* Payment Modal */}
      {showModal && selectedPlan && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: 16,
          }}
          onClick={() => !paying && setShowModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 440,
              padding: "28px 24px 24px",
              boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                  Complete Payment
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                  {selectedPlan.emertimi} &middot; €{selectedPlan.cmimi_mujor}/month
                </div>
              </div>
              <button
                type="button"
                onClick={() => !paying && setShowModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 22,
                  cursor: paying ? "not-allowed" : "pointer",
                  color: "#94a3b8",
                  fontFamily: "inherit",
                  padding: "4px 8px",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            {/* Card Preview */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e293b, #334155)",
                borderRadius: 14,
                padding: "20px 24px",
                marginBottom: 24,
                color: "#fff",
                minHeight: 140,
                position: "relative",
                fontFamily: "'Courier New', monospace",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 600, letterSpacing: "0.06em" }}>
                  {displayBrand || "BANK CARD"}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, opacity: 0.8 }}>{displayBrand === "VISA" ? "V" : displayBrand === "MASTERCARD" ? "MC" : "☰"}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 20, wordSpacing: 8 }}>
                {cardNumber ? cardNumber : "••••  ••••  ••••  ••••"}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 9, opacity: 0.5, textTransform: "uppercase", marginBottom: 2 }}>Cardholder</div>
                  <div style={{ fontSize: 13, fontWeight: 600, minHeight: 18 }}>
                    {cardName.toUpperCase() || "YOUR NAME"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 9, opacity: 0.5, textTransform: "uppercase", marginBottom: 2 }}>Expires</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{cardExpiry || "MM / YY"}</div>
                </div>
              </div>
            </div>

            {/* Card Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Cardholder Name</label>
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="John Doe"
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(15,23,42,0.18)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Card Number</label>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(15,23,42,0.18)",
                    fontSize: 14,
                    fontFamily: "'Courier New', monospace",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Expiry (MM/YY)</label>
                  <input
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM / YY"
                    inputMode="numeric"
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(15,23,42,0.18)",
                      fontSize: 14,
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>CVV</label>
                  <input
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="•••"
                    inputMode="numeric"
                    type="password"
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(15,23,42,0.18)",
                      fontSize: 14,
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                type="button"
                onClick={() => !paying && setShowModal(false)}
                disabled={paying}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "1px solid rgba(15,23,42,0.18)",
                  borderRadius: 10,
                  padding: "12px 0",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: paying ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  color: "#334155",
                  opacity: paying ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={paying}
                style={{
                  flex: 2,
                  background: accent,
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 0",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: paying ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  color: "#fff",
                  opacity: paying ? 0.6 : 1,
                }}
              >
                {paying ? "Processing..." : `Pay €${selectedPlan.cmimi_mujor}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
