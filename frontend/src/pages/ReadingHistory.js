import React, { useState, useEffect } from "react";
import axios from "axios";

const ReadingHistory = () => {
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [record, setRecord] = useState({
        perdoruesi_id: "",
        libri_id: "",
        faqja_aktuale: "",
        perqindja_leximit: 0,
        statusi: "duke e lexuar"
    });

    const fetchData = async () => {
        try {
            const [resU, resB, resH] = await Promise.all([
                axios.get("http://localhost:5000/users"),
                axios.get("http://localhost:5000/books"),
                axios.get("http://localhost:5000/reading-history")
            ]);

            const usersData = resU.data || [];
            const booksData = resB.data || [];
            const historyData = resH.data || [];

            // Kjo pjesë siguron që çdo rekord i historisë t'i ketë emrat, 
            // duke i kërkuar direkt te listat e users dhe books nese JOIN-i nuk ka funksionuar.
            const mappedHistory = historyData.map(h => {
                const user = usersData.find(u => u.id === h.perdoruesi_id);
                const book = booksData.find(b => b.id === h.libri_id);

                return {
                    ...h,
                    emri: h.emri || (user ? user.emri : ""),
                    mbiemri: h.mbiemri || (user ? user.mbiemri : ""),
                    libri_titulli: h.libri_titulli || h.titulli || (book ? book.titulli : "")
                };
            });

            setUsers(usersData);
            setBooks(booksData);
            setHistory(mappedHistory);
        } catch (err) {
            console.error("Gabim gjatë ngarkimit:", err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleFaqjaChange = (val, selectedLibriId = record.libri_id) => {
        const faqja = parseInt(val) || 0;
        const libri = books.find(b => b.id === parseInt(selectedLibriId));

        let perqindja = 0;
        if (libri && libri.numri_faqeve > 0) {
            perqindja = Math.min(Math.round((faqja / libri.numri_faqeve) * 100), 100);
        }

        setRecord(prev => ({
            ...prev,
            faqja_aktuale: faqja,
            perqindja_leximit: perqindja,
            statusi: perqindja === 100 ? "completed" : "duke e lexuar"
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!record.perdoruesi_id || !record.libri_id) return alert("Zgjidhni përdoruesin dhe librin!");

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/reading-history/${record.id}`, record);
            } else {
                await axios.post("http://localhost:5000/reading-history", record);
            }
            resetForm();
            fetchData();
            alert("U ruajt me sukses!");
        } catch (err) {
            alert("Gabim gjatë ruajtjes!");
        }
    };

    const resetForm = () => {
        setRecord({ perdoruesi_id: "", libri_id: "", faqja_aktuale: "", perqindja_leximit: 0, statusi: "duke e lexuar" });
        setIsEditing(false);
    };

    const filteredHistory = history.filter(h => {
        const emri = (h.emri || "").toLowerCase();
        const mbiemri = (h.mbiemri || "").toLowerCase();
        const titulli = (h.libri_titulli || "").toLowerCase();
        const kerkimi = searchTerm.toLowerCase();
        return emri.includes(kerkimi) || mbiemri.includes(kerkimi) || titulli.includes(kerkimi);
    });

    return (
        <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>
            {/* FORMA */}
            <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "40px" }}>
                <h2 style={{ marginTop: 0 }}>{isEditing ? "✏️ Edito Progresin" : "📖 Shto Histori të Re"}</h2>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div>
                        <label style={{ fontWeight: "bold" }}>Përdoruesi:</label>
                        <select
                            value={record.perdoruesi_id}
                            onChange={(e) => setRecord({ ...record, perdoruesi_id: e.target.value })}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "5px" }}
                        >
                            <option value="">-- Zgjidh Përdoruesin --</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.emri} {u.mbiemri}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontWeight: "bold" }}>Libri:</label>
                        <select
                            value={record.libri_id}
                            onChange={(e) => {
                                const id = e.target.value;
                                setRecord({ ...record, libri_id: id });
                                handleFaqjaChange(record.faqja_aktuale, id);
                            }}
                            required
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "5px" }}
                        >
                            <option value="">-- Zgjidh Librin --</option>
                            {books.map(b => <option key={b.id} value={b.id}>{b.titulli} ({b.numri_faqeve} fq)</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontWeight: "bold" }}>Faqja Aktuale:</label>
                        <input
                            type="number"
                            value={record.faqja_aktuale}
                            onChange={(e) => handleFaqjaChange(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "5px" }}
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: "bold" }}>Përqindja:</label>
                        <div style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "5px", background: "#f8f9fa", textAlign: "center", fontWeight: "bold" }}>
                            {record.perqindja_leximit}%
                        </div>
                    </div>
                    <div style={{ gridColumn: "1/-1", display: "flex", gap: "10px" }}>
                        <button type="submit" style={{ flex: 1, padding: "12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                            {isEditing ? "PËRDITËSO" : "RUAJ HISTORINË"}
                        </button>
                        {isEditing && <button type="button" onClick={resetForm} style={{ padding: "12px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Anulo</button>}
                    </div>
                </form>
            </div>

            {/* LISTA */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0 }}>Historia e Leximit</h2>
                <input
                    type="text"
                    placeholder="🔍 Kërko..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "10px 20px", borderRadius: "20px", border: "1px solid #ddd", width: "300px" }}
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {filteredHistory.map((h) => (
                    <div key={h.id} style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", position: "relative", borderLeft: `6px solid ${h.statusi === 'completed' ? '#28a745' : '#ffc107'}` }}>
                        <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", gap: "10px" }}>
                            <button onClick={() => { setRecord(h); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px" }}>✏️</button>
                            <button onClick={async () => { if (window.confirm("A jeni i sigurt?")) { await axios.delete(`http://localhost:5000/reading-history/${h.id}`); fetchData(); } }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px" }}>🗑️</button>
                        </div>

                        {/* Këtu shfaqet vetëm Emri dhe Mbiemri */}
                        <small style={{ color: "#007bff", fontWeight: "bold", textTransform: "uppercase", fontSize: "11px" }}>
                            👤 {h.emri} {h.mbiemri}
                        </small>

                        {/* Këtu shfaqet vetëm Titulli i Librit */}
                        <h4 style={{ margin: "8px 0", color: "#2d3748", fontSize: "18px" }}>
                            {h.libri_titulli}
                        </h4>

                        <div style={{ marginTop: "15px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px", color: "#4a5568" }}>
                                <span>Progresi: <strong>{h.perqindja_leximit}%</strong></span>
                                <span>Faqja: <strong>{h.faqja_aktuale}</strong></span>
                            </div>
                            <div style={{ width: "100%", height: "8px", background: "#edf2f7", borderRadius: "10px", overflow: "hidden" }}>
                                <div style={{ width: `${h.perqindja_leximit}%`, height: "100%", background: h.statusi === 'completed' ? "#28a745" : "#4a90e2", transition: "width 0.5s ease-in-out" }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReadingHistory;