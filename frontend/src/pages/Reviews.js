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
        komenti: ""
    });

    const fetchData = async () => {
        try {
            const [resR, resU, resB] = await Promise.all([
                axios.get("http://localhost:5000/reviews"),
                axios.get("http://localhost:5000/users"),
                axios.get("http://localhost:5000/books")
            ]);
            setReviews(resR.data || []);
            setUsers(resU.data || []);
            setBooks(resB.data || []);
        } catch (err) { console.error("Gabim në ngarkim:", err); }
    };

    useEffect(() => { fetchData(); }, []);

    // Funksioni universal për ndryshimin e inputeve (Zgjidh problemin e selektimit)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecord({ ...record, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!record.perdoruesi_id || !record.libri_id) return alert("Ju lutem zgjidhni Përdoruesin dhe Librin!");
        
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/reviews/${record.id}`, record);
            } else {
                await axios.post("http://localhost:5000/reviews", record);
            }
            resetForm();
            fetchData();
        } catch (err) { alert("Gabim gjatë ruajtjes!"); }
    };

    const resetForm = () => {
        setRecord({ perdoruesi_id: "", libri_id: "", vleresimi: 5, komenti: "" });
        setIsEditing(false);
    };

    // STILE
    const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "5px", fontSize: "15px", backgroundColor: "#fff" };
    const starBtnStyle = (num) => ({
        fontSize: "25px",
        cursor: "pointer",
        color: num <= record.vleresimi ? "#ffc107" : "#e4e5e9",
        background: "none",
        border: "none",
        padding: "0 2px"
    });

    return (
        <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 25px rgba(0,0,0,0.1)", marginBottom: "40px" }}>
                <h2 style={{ marginTop: 0 }}>{isEditing ? "✏️ Edito Review" : "⭐ Shto një Review"}</h2>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    
                    {/* SELEKTIMI I PËRDORUESIT */}
                    <div>
                        <label style={{ fontWeight: "600" }}>Zgjidh Përdoruesin:</label>
                        <select 
                            name="perdoruesi_id" 
                            value={record.perdoruesi_id} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle}
                        >
                            <option value="">-- Kliko për të zgjedhur --</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.emri} {u.mbiemri}</option>)}
                        </select>
                    </div>

                    {/* SELEKTIMI I LIBRIT */}
                    <div>
                        <label style={{ fontWeight: "600" }}>Zgjidh Librin:</label>
                        <select 
                            name="libri_id" 
                            value={record.libri_id} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle}
                        >
                            <option value="">-- Kliko për të zgjedhur --</option>
                            {books.map(b => <option key={b.id} value={b.id}>{b.titulli}</option>)}
                        </select>
                    </div>

                    {/* SELEKTIMI I YJEVE (Visual) */}
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "10px", background: "#f9f9f9", borderRadius: "10px" }}>
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>Vlerësimi me yje:</label>
                        {[1, 2, 3, 4, 5].map(num => (
                            <button 
                                key={num} 
                                type="button" 
                                onClick={() => setRecord({ ...record, vleresimi: num })}
                                style={starBtnStyle(num)}
                            >
                                ★
                            </button>
                        ))}
                        <span style={{ marginLeft: "10px", fontWeight: "bold" }}>({record.vleresimi}/5)</span>
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontWeight: "600" }}>Komenti juaj:</label>
                        <textarea 
                            name="komenti" 
                            value={record.komenti} 
                            onChange={handleChange} 
                            placeholder="Shkruani diçka për librin..." 
                            style={{ ...inputStyle, height: "100px", resize: "none" }} 
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                        <button type="submit" style={{ flex: 2, padding: "15px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}>
                            {isEditing ? "PËRDITËSO" : "RUAJ REVIEW"}
                        </button>
                        {isEditing && <button type="button" onClick={resetForm} style={{ flex: 1, background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Anulo</button>}
                    </div>
                </form>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
                {reviews.map(r => (
                    <div key={r.id} style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 3px 15px rgba(0,0,0,0.05)", position: "relative", borderTop: "6px solid #ffc107" }}>
                        <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", gap: "10px" }}>
                            <button onClick={() => { setRecord(r); setIsEditing(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px" }}>✏️</button>
                            <button onClick={async () => { if(window.confirm("Fshije?")) { await axios.delete(`http://localhost:5000/reviews/${r.id}`); fetchData(); } }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px" }}>🗑️</button>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <small style={{ color: "#777", textTransform: "uppercase", fontWeight: "bold", fontSize: "11px" }}>Përdoruesi</small>
                            <div style={{ fontWeight: "600" }}>{r.emri} {r.mbiemri}</div>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <small style={{ color: "#777", textTransform: "uppercase", fontWeight: "bold", fontSize: "11px" }}>Libri</small>
                            <div style={{ fontWeight: "600", color: "#007bff" }}>{r.titulli}</div>
                        </div>
                        <div style={{ color: "#ffc107", fontSize: "20px", margin: "10px 0" }}>
                            {"★".repeat(r.vleresimi)}{"☆".repeat(5 - r.vleresimi)}
                        </div>
                        <p style={{ fontSize: "14px", color: "#555", fontStyle: "italic", background: "#f9f9f9", padding: "10px", borderRadius: "8px" }}>
                            "{r.komenti || "Nuk ka koment."}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;