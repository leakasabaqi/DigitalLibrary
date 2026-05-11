import React, { useState, useEffect } from "react";
import axios from "axios";

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [record, setRecord] = useState({ 
        perdoruesi_id: "", 
        libri_id: "", 
        faqja: "", 
        shenime: "" 
    });

    const fetchData = async () => {
        try {
            const [resBM, resU, resB] = await Promise.all([
                axios.get("http://localhost:5000/bookmarks"),
                axios.get("http://localhost:5000/users"),
                axios.get("http://localhost:5000/books")
            ]);
            setBookmarks(resBM.data || []);
            setUsers(resU.data || []);
            setBooks(resB.data || []);
        } catch (err) { console.error("Gabim:", err); }
    };

    useEffect(() => { fetchData(); }, []);

    // KY FUNKSION I ZGJIDH GJITHA PROBLEMET E SELEKTIMIT
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecord(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/bookmarks/${record.id}`, record);
            } else {
                await axios.post("http://localhost:5000/bookmarks", record);
            }
            resetForm();
            fetchData();
        } catch (err) { alert("Gabim gjatë ruajtjes!"); }
    };

    const resetForm = () => {
        setRecord({ perdoruesi_id: "", libri_id: "", faqja: "", shenime: "" });
        setIsEditing(false);
    };

    return (
        <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
                <h2>{isEditing ? "✏️ Edito Shënuesin" : "🔖 Shto Shënues të Ri"}</h2>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    
                    {/* SELEKTIMI I PËRDORUESIT - TASH PUNON 100% */}
                    <div>
                        <label style={{fontWeight:"bold", display:"block", marginBottom:"5px"}}>Zgjidh Përdoruesin:</label>
                        <select 
                            name="perdoruesi_id" 
                            value={record.perdoruesi_id} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc" }}
                        >
                            <option value="">-- Selekto Përdoruesin --</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.emri} {u.mbiemri}</option>
                            ))}
                        </select>
                    </div>

                    {/* SELEKTIMI I LIBRIT */}
                    <div>
                        <label style={{fontWeight:"bold", display:"block", marginBottom:"5px"}}>Zgjidh Librin:</label>
                        <select 
                            name="libri_id" 
                            value={record.libri_id} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc" }}
                        >
                            <option value="">-- Selekto Librin --</option>
                            {books.map(b => (
                                <option key={b.id} value={b.id}>{b.titulli}</option>
                            ))}
                        </select>
                    </div>

                    {/* FAQJA E LIBRIT */}
                    <div>
                        <label style={{fontWeight:"bold", display:"block", marginBottom:"5px"}}>Faqja:</label>
                        <input 
                            type="number" 
                            name="faqja" 
                            value={record.faqja} 
                            onChange={handleChange} 
                            placeholder="Shëno faqen..." 
                            required 
                            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
                        />
                    </div>

                    {/* SHËNIME SHTESË */}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{fontWeight:"bold", display:"block", marginBottom:"5px"}}>Shënime:</label>
                        <textarea 
                            name="shenime" 
                            value={record.shenime} 
                            onChange={handleChange} 
                            placeholder="Shkruaj diçka për këtë faqe..."
                            style={{ width: "100%", padding: "12px", height: "80px", borderRadius: "6px", border: "1px solid #ccc", resize: "none" }} 
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                        <button type="submit" style={{ flex: 1, padding: "15px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                            {isEditing ? "PËRDITËSO" : "RUUAJ SHËNUESIN"}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} style={{ padding: "15px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                                ANULO
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* LISTIMI I BOOKMARKS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {bookmarks.map(bm => (
                    <div key={bm.id} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderLeft: "6px solid #28a745" }}>
                        <div style={{ float: "right" }}>
                            <button onClick={() => { setRecord(bm); setIsEditing(true); window.scrollTo({top:0, behavior:'smooth'}); }} style={{ border: "none", background: "none", cursor: "pointer" }}>✏️</button>
                            <button onClick={async () => { if(window.confirm("Fshije?")) { await axios.delete(`http://localhost:5000/bookmarks/${bm.id}`); fetchData(); } }} style={{ border: "none", background: "none", cursor: "pointer" }}>🗑️</button>
                        </div>
                        <h4 style={{margin: "0 0 10px 0"}}>📖 {bm.titulli}</h4>
                        <p style={{fontSize: "14px", margin: "5px 0"}}>👤 {bm.emri} {bm.mbiemri}</p>
                        <p style={{fontSize: "14px", margin: "5px 0"}}>📍 Faqja: <strong>{bm.faqja}</strong></p>
                        <p style={{fontSize: "13px", color: "#666", background: "#f9f9f9", padding: "10px", borderRadius: "5px", marginTop: "10px"}}>
                            {bm.shenime || "Nuk ka shënime."}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookmarks;