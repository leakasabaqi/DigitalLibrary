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
        pagesa_automatike: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resSub, resUsers, resPlans] = await Promise.all([
                axios.get("http://localhost:5000/subscriptions"),
                axios.get("http://localhost:5000/users"),
                axios.get("http://localhost:5000/plans")
            ]);
            setSubscriptions(resSub.data);
            setUsers(resUsers.data);
            setPlans(resPlans.data);
        } catch (err) {
            console.error(err);
            alert("Gabim gjatë ngarkimit të të dhënave!");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSubscription({
            ...subscription,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        });
    };

    const handleEdit = (s) => {
        setSubscription({
            ...s,
            data_fillimit: s.data_fillimit.split('T')[0],
            data_skadimit: s.data_skadimit.split('T')[0]
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("A jeni të sigurt që dëshironi ta fshini këtë abonim?")) {
            try {
                await axios.delete(`http://localhost:5000/subscriptions/${id}`);
                fetchData();
            } catch (err) {
                alert("Gabim gjatë fshirjes");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isUpdate = subscription.id ? true : false;
        const url = isUpdate
            ? `http://localhost:5000/subscriptions/${subscription.id}`
            : "http://localhost:5000/subscriptions";

        try {
            if (isUpdate) {
                await axios.put(url, subscription);
            } else {
                await axios.post(url, subscription);
            }

            alert(isUpdate ? "Abonimi u përditësua!" : "Abonimi u shtua!");
            setSubscription({
                perdoruesi_id: "",
                plani_id: "",
                data_fillimit: "",
                data_skadimit: "",
                statusi: "aktiv",
                pagesa_automatike: 0
            });
            fetchData();
        } catch (err) {
            alert("Gabim nga serveri: " + (err.response?.data || "Nuk u arrit lidhja"));
        }
    };

    // Stilet për Cards
    const cardContainerStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1.5rem",
        marginTop: "3rem"
    };

    const cardStyle = {
        background: "white",
        borderRadius: "15px",
        padding: "1.5rem",
        border: "1px solid #e2e8f0",
        position: "relative",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column"
    };

    const statusBadge = (status) => ({
        position: "absolute",
        top: "1rem",
        right: "1rem",
        padding: "0.25rem 0.75rem",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "bold",
        background: status === "aktiv" ? "#c6f6d5" : "#fed7d7",
        color: status === "aktiv" ? "#22543d" : "#822727",
        textTransform: "uppercase"
    });

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif", padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "2.5rem", boxShadow: "0 4px 25px rgba(0,0,0,0.1)", maxWidth: "900px", margin: "0 auto" }}>
                <h2 style={{ color: "#2d3748", marginBottom: "2rem" }}>
                    {subscription.id ? "✏️ Edit Subscription" : "➕ Add New Subscription"}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    <div>
                        <label style={{ fontWeight: "600", color: "#4a5568" }}>Select User *</label>
                        <select name="perdoruesi_id" value={subscription.perdoruesi_id} onChange={handleChange} required
                            style={{ width: "100%", padding: "0.875rem", borderRadius: "8px", border: "2px solid #e2e8f0" }}>
                            <option value="">-- Choose User --</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.emri} {u.mbiemri}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontWeight: "600", color: "#4a5568" }}>Select Plan *</label>
                        <select name="plani_id" value={subscription.plani_id} onChange={handleChange} required
                            style={{ width: "100%", padding: "0.875rem", borderRadius: "8px", border: "2px solid #e2e8f0" }}>
                            <option value="">-- Choose Plan --</option>
                            {plans.map(p => (
                                <option key={p.id} value={p.id}>{p.emertimi} (€{p.cmimi_mujor})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontWeight: "600", color: "#4a5568" }}>Start Date *</label>
                        <input type="date" name="data_fillimit" value={subscription.data_fillimit} onChange={handleChange} required
                            style={{ width: "100%", padding: "0.875rem", borderRadius: "8px", border: "2px solid #e2e8f0" }} />
                    </div>

                    <div>
                        <label style={{ fontWeight: "600", color: "#4a5568" }}>Expiry Date *</label>
                        <input type="date" name="data_skadimit" value={subscription.data_skadimit} onChange={handleChange} required
                            style={{ width: "100%", padding: "0.875rem", borderRadius: "8px", border: "2px solid #e2e8f0" }} />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                            <input type="checkbox" name="pagesa_automatike"
                                checked={subscription.pagesa_automatike === 1} onChange={handleChange}
                                style={{ width: "18px", height: "18px" }} />
                            Enable Automatic Payment
                        </label>
                    </div>

                    <button type="submit" style={{ gridColumn: "1 / -1", padding: "1rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "50px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)" }}>
                        {subscription.id ? "Save Changes" : "Create Subscription"}
                    </button>
                </form>
            </div>

            <div style={cardContainerStyle}>
                {subscriptions.map((s) => (
                    <div key={s.id} style={cardStyle}>
                        <div style={statusBadge(s.statusi)}>{s.statusi}</div>

                        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", gap: "1rem" }}>
                            <div style={{ width: "45px", height: "45px", borderRadius: "12px", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                                👤
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#2d3748" }}>
                                    {(() => {
                                        const user = users.find(u => String(u.id) === String(s.perdoruesi_id));
                                        return user ? `${user.emri} ${user.mbiemri}` : `Përdoruesi #${s.perdoruesi_id}`;
                                    })()}
                                </h3>
                                <p style={{ margin: 0, fontSize: "0.85rem", color: "#667eea", fontWeight: "600" }}>
                                    {(() => {
                                        const plan = plans.find(p => String(p.id) === String(s.plani_id));
                                        return plan ? plan.emertimi : "Premium Plan";
                                    })()}
                                </p>                            </div>
                        </div>

                        <div style={{ fontSize: "0.9rem", color: "#4a5568", marginBottom: "1.5rem" }}>
                            <div style={{ marginBottom: "0.4rem" }}>📅 Fillon: <b>{new Date(s.data_fillimit).toLocaleDateString()}</b></div>
                            <div>⏳ Skadon: <b>{new Date(s.data_skadimit).toLocaleDateString()}</b></div>
                            {s.pagesa_automatike === 1 && (
                                <div style={{ marginTop: "0.5rem", color: "#38a169", fontSize: "0.8rem", fontWeight: "bold" }}>
                                    🔄 Automatic Payment Active
                                </div>
                            )}
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", justifyContent: "flex-end" }}>
                            <button onClick={() => handleEdit(s)} style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "8px", background: "#ebf8ff", color: "#2b6cb0", cursor: "pointer", fontWeight: "600" }}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(s.id)} style={{ padding: "0.5rem 1rem", border: "none", borderRadius: "8px", background: "#fff5f5", color: "#c53030", cursor: "pointer", fontWeight: "600" }}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddSubscription;