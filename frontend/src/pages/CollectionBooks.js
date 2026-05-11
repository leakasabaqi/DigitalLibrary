import React, { useState, useEffect } from "react";
import axios from "axios";

const CollectionBooks = () => {
    const [list, setList] = useState([]);
    const [collections, setCollections] = useState([]);
    const [books, setBooks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [record, setRecord] = useState({ koleksioni_id: "", libri_id: "" });

    const fetchData = async () => {
        try {
            const [resCB, resC, resB] = await Promise.all([
                axios.get("http://localhost:5000/collection-books"),
                axios.get("http://localhost:5000/collections"),
                axios.get("http://localhost:5000/books")
            ]);
            setList(resCB.data || []);
            setCollections(resC.data || []);
            setBooks(resB.data || []);
        } catch (err) { 
            console.error("Gabim gjatë ngarkimit të të dhënave:", err); 
        }
    };

    useEffect(() => { fetchData(); }, []);

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
                await axios.put(`http://localhost:5000/collection-books/${record.id}`, record);
            } else {
                await axios.post("http://localhost:5000/collection-books", record);
            }
            resetForm();
            fetchData();
        } catch (err) { 
            alert("Gabim gjatë ruajtjes së të dhënave!"); 
        }
    };

    const resetForm = () => {
        setRecord({ koleksioni_id: "", libri_id: "" });
        setIsEditing(false);
    };

    const handleEdit = (item) => {
        setRecord(item);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
            {/* FORMA PËR SHTIM DHE EDITIM */}
            <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
                <h2 style={{ color: "#333", marginBottom: "20px" }}>
                    {isEditing ? "✏️ Edito Librin në Koleksion" : "📚 Shto Libër në Koleksion"}
                </h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", gap: "15px", alignItems: "flex-end", flexWrap: "wrap" }}>
                    
                    <div style={{ flex: "1", minWidth: "250px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#555" }}>
                            Zgjidh Koleksionin:
                        </label>
                        <select 
                            name="koleksioni_id" 
                            value={record.koleksioni_id} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}
                        >
                            <option value="">-- Koleksioni (Pronari) --</option>
                            {collections.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.emertimi} (nga {c.emri} {c.mbiemri})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: "1", minWidth: "250px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#555" }}>
                            Zgjidh Librin:
                        </label>
                        <select 
                            name="libri_id" 
                            value={record.libri_id} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}
                        >
                            <option value="">-- Libri --</option>
                            {books.map(b => (
                                <option key={b.id} value={b.id}>{b.titulli}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button 
                            type="submit" 
                            style={{ 
                                padding: "12px 30px", 
                                background: isEditing ? "#ffc107" : "#007bff", 
                                color: isEditing ? "#000" : "#fff", 
                                border: "none", 
                                borderRadius: "8px", 
                                cursor: "pointer", 
                                fontWeight: "bold",
                                fontSize: "14px"
                            }}
                        >
                            {isEditing ? "PËRDITËSO" : "SHTO"}
                        </button>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                style={{ padding: "12px 20px", background: "#f0f0f0", border: "none", borderRadius: "8px", cursor: "pointer" }}
                            >
                                Anulo
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* TABELA E REZULTATEVE */}
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 15px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #eee" }}>
                        <tr>
                            <th style={{ padding: "18px", textAlign: "left", color: "#444" }}>📁 Koleksioni</th>
                            <th style={{ padding: "18px", textAlign: "left", color: "#444" }}>👤 Krijuar nga</th>
                            <th style={{ padding: "18px", textAlign: "left", color: "#444" }}>📖 Libri</th>
                            <th style={{ padding: "18px", textAlign: "center", color: "#444" }}>📅 Data e Shtimit</th>
                            <th style={{ padding: "18px", textAlign: "center", color: "#444" }}>Veprimet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length > 0 ? list.map(item => (
                            <tr key={item.id} style={{ borderBottom: "1px solid #f2f2f2", transition: "0.2s" }}>
                                <td style={{ padding: "15px", fontWeight: "500" }}>{item.koleksioni}</td>
                                <td style={{ padding: "15px", color: "#666" }}>{item.pronari_emri} {item.pronari_mbiemri}</td>
                                <td style={{ padding: "15px" }}>{item.libri}</td>
                                <td style={{ padding: "15px", textAlign: "center", fontSize: "13px", color: "#999" }}>
                                    {new Date(item.data_shtimit).toLocaleDateString()}
                                </td>
                                <td style={{ padding: "15px", textAlign: "center" }}>
                                    <button 
                                        onClick={() => handleEdit(item)} 
                                        style={{ border: "none", background: "none", cursor: "pointer", marginRight: "12px", fontSize: "18px" }}
                                        title="Edito"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={async () => { 
                                            if(window.confirm("A jeni të sigurt që dëshironi ta hiqni këtë libër nga koleksioni?")) { 
                                                await axios.delete(`http://localhost:5000/collection-books/${item.id}`); 
                                                fetchData(); 
                                            } 
                                        }} 
                                        style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px" }}
                                        title="Fshij"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "#aaa" }}>
                                    Nuk u gjet asnjë libër në koleksione.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CollectionBooks;