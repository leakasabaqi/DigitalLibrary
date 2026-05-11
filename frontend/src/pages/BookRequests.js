import React, { useState, useEffect } from "react";
import axios from "axios";

const BookRequests = () => {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [record, setRecord] = useState({ 
        perdoruesi_id: "", 
        titulli_librit: "", 
        autori: "", 
        statusi: "Ne Pritje" 
    });

    const fetchData = async () => {
        try {
            const [resBR, resU] = await Promise.all([
                axios.get("http://localhost:5000/book-requests"),
                axios.get("http://localhost:5000/users")
            ]);
            setRequests(resBR.data || []);
            setUsers(resU.data || []);
        } catch (err) { console.error("Gabim:", err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecord(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (item) => {
        setRecord(item);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/book-requests/${record.id}`, record);
            } else {
                await axios.post("http://localhost:5000/book-requests", { ...record, statusi: "Ne Pritje" });
            }
            resetForm();
            fetchData();
        } catch (err) { alert("Gabim gjatë ruajtjes!"); }
    };

    const resetForm = () => {
        setRecord({ perdoruesi_id: "", titulli_librit: "", autori: "", statusi: "Ne Pritje" });
        setIsEditing(false);
    };

    return (
        <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
                <h2 style={{ color: "#333", marginBottom: "25px" }}>
                    {isEditing ? "✏️ Edito Statusin e Kërkesës" : "📢 Kërkesë e Re për Libër"}
                </h2>
                
                <form 
                    onSubmit={handleSubmit} 
                    style={{ 
                        display: "grid", 
                        // Rregullon kolonat: 3 kur shton, 2 kur editon (pasi statusi del poshtë)
                        gridTemplateColumns: isEditing ? "1fr 1fr" : "repeat(3, 1fr)", 
                        gap: "20px", 
                        alignItems: "end" 
                    }}
                >
                    {/* Përdoruesi */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>Përdoruesi:</label>
                        <select 
                            name="perdoruesi_id" 
                            value={record.perdoruesi_id} 
                            onChange={handleChange} 
                            required 
                            disabled={isEditing} 
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }}
                        >
                            <option value="">-- Zgjidh --</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.emri} {u.mbiemri}</option>)}
                        </select>
                    </div>

                    {/* Titulli */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>Titulli i Librit:</label>
                        <input 
                            type="text" 
                            name="titulli_librit" 
                            value={record.titulli_librit} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} 
                        />
                    </div>

                    {/* Autori */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>Autori:</label>
                        <input 
                            type="text" 
                            name="autori" 
                            value={record.autori} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} 
                        />
                    </div>

                    {/* Statusi - Shfaqet vetëm në editim dhe zë krejt rreshtin e ri */}
                    {isEditing && (
                        <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#007bff" }}>Ndrysho Statusin:</label>
                            <select 
                                name="statusi" 
                                value={record.statusi} 
                                onChange={handleChange} 
                                required 
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #007bff", fontWeight: "bold", backgroundColor: "#f8fbff" }}
                            >
                                <option value="Ne Pritje">⏳ Ne Pritje</option>
                                <option value="E Miratuar">✅ E Miratuar</option>
                                <option value="E Refuzuar">❌ E Refuzuar</option>
                            </select>
                        </div>
                    )}

                    {/* Buttonat */}
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button 
                            type="submit" 
                            style={{ 
                                flex: 1, 
                                padding: "15px", 
                                background: isEditing ? "#ffc107" : "#007bff", 
                                color: isEditing ? "#000" : "#fff", 
                                border: "none", 
                                borderRadius: "8px", 
                                cursor: "pointer", 
                                fontWeight: "bold" 
                            }}
                        >
                            {isEditing ? "PËRDITËSO STATUSIN" : "RUAJ KËRKESËN"}
                        </button>
                        {isEditing && (
                            <button 
                                onClick={resetForm} 
                                type="button" 
                                style={{ padding: "15px 25px", background: "#f0f0f0", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
                            >
                                Anulo
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tabela mbetet e njëjtë */}
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 15px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                            <th style={{ padding: "15px", textAlign: "left" }}>Përdoruesi</th>
                            <th style={{ padding: "15px", textAlign: "left" }}>Libri i Kërkuar</th>
                            <th style={{ padding: "15px", textAlign: "center" }}>Statusi</th>
                            <th style={{ padding: "15px", textAlign: "center" }}>Veprimet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(br => (
                            <tr key={br.id} style={{ borderTop: "1px solid #eee" }}>
                                <td style={{ padding: "15px" }}>👤 {br.emri} {br.mbiemri}</td>
                                <td style={{ padding: "15px" }}>
                                    <strong>{br.titulli_librit}</strong> <br/>
                                    <small style={{color: "#888"}}>nga {br.autori}</small>
                                </td>
                                <td style={{ padding: "15px", textAlign: "center" }}>
                                    <span style={{ 
                                        padding: "6px 12px", 
                                        borderRadius: "20px", 
                                        fontSize: "12px", 
                                        fontWeight: "bold",
                                        background: br.statusi === 'E Miratuar' ? '#d4edda' : br.statusi === 'E Refuzuar' ? '#f8d7da' : '#fff3cd',
                                        color: br.statusi === 'E Miratuar' ? '#155724' : br.statusi === 'E Refuzuar' ? '#721c24' : '#856404'
                                    }}>
                                        {br.statusi}
                                    </span>
                                </td>
                                <td style={{ padding: "15px", textAlign: "center" }}>
                                    <button onClick={() => handleEdit(br)} style={{ border: "none", background: "none", cursor: "pointer", marginRight: "10px", fontSize: "18px" }}>✏️</button>
                                    <button onClick={async () => { if(window.confirm("Fshije?")) { await axios.delete(`http://localhost:5000/book-requests/${br.id}`); fetchData(); } }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px" }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookRequests;