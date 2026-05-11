import React, { useState, useEffect } from "react";
import axios from "axios";

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [record, setRecord] = useState({
        perdoruesi_id: "",
        emertimi: "",
        pershkrimi: "",
        a_eshte_publike: 0
    });

    const fetchData = async () => {
        try {
            const [resC, resU] = await Promise.all([
                axios.get("http://localhost:5000/collections"),
                axios.get("http://localhost:5000/users")
            ]);
            setCollections(resC.data || []);
            setUsers(resU.data || []);
        } catch (err) { console.error("Gabim në ngarkim:", err); }
    };

    useEffect(() => { fetchData(); }, []);

    // Ky funksion siguron që selektimi të punojë për çdo fushë
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecord(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!record.perdoruesi_id) return alert("Ju lutem zgjidhni një përdorues!");
        
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/collections/${record.id}`, record);
            } else {
                await axios.post("http://localhost:5000/collections", record);
            }
            setRecord({ perdoruesi_id: "", emertimi: "", pershkrimi: "", a_eshte_publike: 0 });
            setIsEditing(false);
            fetchData();
        } catch (err) { alert("Gabim gjatë ruajtjes!"); }
    };

    return (
        <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", marginBottom: "40px" }}>
                <h2>{isEditing ? "✏️ Edito Koleksionin" : "📁 Krijo Koleksion të Ri"}</h2>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    
                    {/* SELEKTIMI I PËRDORUESIT - TASH PUNON */}
                    <div>
                        <label style={{fontWeight: "bold", display: "block", marginBottom: "5px"}}>Pronari i Koleksionit:</label>
                        <select 
                            name="perdoruesi_id" 
                            value={record.perdoruesi_id} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc" }}
                        >
                            <option value="">-- Zgjidh Përdoruesin --</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.emri} {u.mbiemri}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{fontWeight: "bold", display: "block", marginBottom: "5px"}}>Emërtimi:</label>
                        <input 
                            type="text" 
                            name="emertimi" 
                            value={record.emertimi} 
                            onChange={handleChange} 
                            required 
                            placeholder="Emri i koleksionit..." 
                            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} 
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{fontWeight: "bold", display: "block", marginBottom: "5px"}}>Përshkrimi:</label>
                        <textarea 
                            name="pershkrimi" 
                            value={record.pershkrimi} 
                            onChange={handleChange} 
                            placeholder="Përshkruani këtë koleksion..."
                            style={{ width: "100%", padding: "12px", height: "80px", borderRadius: "6px", border: "1px solid #ccc", resize: "none" }} 
                        />
                    </div>

                    <div>
                        <label style={{fontWeight: "bold", display: "block", marginBottom: "5px"}}>Statusi:</label>
                        <select 
                            name="a_eshte_publike" 
                            value={record.a_eshte_publike} 
                            onChange={handleChange} 
                            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc" }}
                        >
                            <option value={0}>Privat 🔒</option>
                            <option value={1}>Publik 🌍</option>
                        </select>
                    </div>

                    <button type="submit" style={{ gridColumn: "1 / -1", padding: "15px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
                        {isEditing ? "PËRDITËSO KOLEKSIONIN" : "KRIJO KOLEKSIONIN"}
                    </button>
                </form>
            </div>

            {/* LISTIMI I KOLEKSIONEVE */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
                {collections.map(c => (
                    <div key={c.id} style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 3px 15px rgba(0,0,0,0.05)", position: "relative", borderTop: "6px solid #28a745" }}>
                        <div style={{ position: "absolute", top: "15px", right: "15px" }}>
                            <button onClick={() => { setRecord(c); setIsEditing(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px" }}>✏️</button>
                            <button onClick={async () => { if(window.confirm("A dëshironi ta fshini këtë koleksion?")) { await axios.delete(`http://localhost:5000/collections/${c.id}`); fetchData(); } }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px" }}>🗑️</button>
                        </div>
                        <small style={{ color: "#888", fontWeight: "bold", textTransform: "uppercase" }}>👤 {c.emri} {c.mbiemri}</small>
                        <h3 style={{ margin: "10px 0" }}>{c.emertimi} {c.a_eshte_publike === 1 ? "🌍" : "🔒"}</h3>
                        <p style={{ fontSize: "14px", color: "#555", background: "#f9f9f9", padding: "10px", borderRadius: "8px" }}>
                            {c.pershkrimi || "Nuk ka përshkrim."}
                        </p>
                        <div style={{ fontSize: "11px", color: "#bbb", marginTop: "10px" }}>
                            Krijuar më: {new Date(c.data_krijimit).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collections;