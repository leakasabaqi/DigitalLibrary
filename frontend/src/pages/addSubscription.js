import React, { useState, useEffect } from "react";
import axios from "axios";

const AddSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);

  const [subscription, setSubscription] = useState({
    perdoruesi_id: "",
    plani_id: "",
    data_fillimit: "",
    data_skadimit: "",
    statusi: "aktiv",
    pagesa_automatike: 0,
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [resSub, resUsers, resPlans] = await Promise.all([
        axios.get("http://localhost:5000/subscriptions"),
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/plans"),
      ]);
      setSubscriptions(resSub.data || []);
      setUsers(resUsers.data || []);
      setPlans(resPlans.data || []);
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ngarkimit të të dhënave!");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSubscription((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleEdit = (s) => {
    setSubscription({
      ...s,
      data_fillimit: s.data_fillimit?.split("T")?.[0] || "",
      data_skadimit: s.data_skadimit?.split("T")?.[0] || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!await window.confirm("A jeni të sigurt që dëshironi ta fshini këtë abonim?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/subscriptions/${id}`);
      fetchData();
    } catch (err) {
      alert("Gabim gjatë fshirjes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isUpdate = Boolean(subscription.id);
    const url = isUpdate
      ? `http://localhost:5000/subscriptions/${subscription.id}`
      : "http://localhost:5000/subscriptions";

    try {
      if (isUpdate) await axios.put(url, subscription);
      else await axios.post(url, subscription);

      alert(isUpdate ? "Abonimi u përditësua!" : "Abonimi u shtua!");
      setSubscription({
        perdoruesi_id: "",
        plani_id: "",
        data_fillimit: "",
        data_skadimit: "",
        statusi: "aktiv",
        pagesa_automatike: 0,
      });
      fetchData();
    } catch (err) {
      alert(
        "Gabim nga serveri: " + (err.response?.data || "Nuk u arrit lidhja"),
      );
    }
  };

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {subscription.id ? "Edit Subscription" : "Add New Subscription"}
            </div>
            <div className="cardSubtitle">Create and manage subscriptions</div>
          </div>
          <div className="help">
            {subscription.id
              ? "Update subscription details"
              : "Add a new user subscription"}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="formGrid"
        >
          <div className="field">
            <label className="label">Select User *</label>
            <select
              className="select"
              name="perdoruesi_id"
              value={subscription.perdoruesi_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.emri} {u.mbiemri}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Select Plan *</label>
            <select
              className="select"
              name="plani_id"
              value={subscription.plani_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Plan --</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emertimi} ({p.cmimi_mujor}€)
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Start Date *</label>
            <input
              className="input"
              type="date"
              name="data_fillimit"
              value={subscription.data_fillimit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="label">Expiry Date *</label>
            <input
              className="input"
              type="date"
              name="data_skadimit"
              value={subscription.data_skadimit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label
              className="help"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="pagesa_automatike"
                checked={subscription.pagesa_automatike === 1}
                onChange={handleChange}
                style={{
                  width: 18,
                  height: 18,
                  accentColor: "rgba(37,99,235,1)",
                }}
              />
              Enable Automatic Payment
            </label>
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {subscription.id ? "Save Changes" : "Create Subscription"}
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <div className="cardTitle">Subscriptions Directory</div>
            <div className="cardSubtitle">
              All active and inactive subscriptions
            </div>
          </div>
          <div className="help">{subscriptions.length} entries</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {subscriptions.map((s) => {
            const user = users.find(
              (u) => String(u.id) === String(s.perdoruesi_id),
            );
            const plan = plans.find((p) => String(p.id) === String(s.plani_id));

            const isActive = String(s.statusi) === "aktiv";
            return (
              <div key={s.id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <span
                    className={`badge ${isActive ? "badgeSuccess" : "badgeDanger"}`}
                    style={{ marginTop: 4 }}
                  >
                    {s.statusi}
                  </span>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(s)}
                      className="btn btnGhost"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="btn btnGhost"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="hr" />

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 900, marginBottom: 2 }}>
                    {user
                      ? `${user.emri} ${user.mbiemri}`
                      : `User #${s.perdoruesi_id}`}
                  </div>
                  <div
                    className="help"
                    style={{ fontWeight: 900, color: "#1d4ed8" }}
                  >
                    {plan ? plan.emertimi : "Premium Plan"}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <div className="help" style={{ color: "#0f172a" }}>
                    Start:{" "}
                    <span style={{ fontWeight: 900 }}>
                      {new Date(s.data_fillimit).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="help" style={{ color: "#0f172a" }}>
                    Expiry:{" "}
                    <span style={{ fontWeight: 900 }}>
                      {new Date(s.data_skadimit).toLocaleDateString()}
                    </span>
                  </div>
                  {s.pagesa_automatike === 1 ? (
                    <div
                      className="badge badgeSuccess"
                      style={{ justifyContent: "flex-start" }}
                    >
                      Automatic payment enabled
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddSubscription;
