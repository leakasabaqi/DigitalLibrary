import React, { useState, useEffect } from "react";
import axios from "axios";

const Wishlists = () => {
    const [wishlist, setWishlist] = useState([]);
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [record, setRecord] = useState({ perdoruesi_id: "", libri_id: "" });

    const fetchData = async () => {
        try {
            const [resW, resU, resB] = await Promise.all([
                axios.get("http://localhost:5000/wishlists"),
                axios.get("http://localhost:5000/users"),
                axios.get("http://localhost:5000/books")
            ]);
            setWishlist(resW.data || []);
            setUsers(resU.data || []);
            setBooks(resB.data || []);
        } catch (err) { console.error("Gabim:", err); }
    };

    useEffect(() => { fetchData(); }, []);

    // KY FUNKSION E NDREQ PROBLEMIN E SELEKTIMIT
    const handleChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/wishlists/${record.id}`, record);
            } else {
                await axios.post("http://localhost:5000/wishlists", record);
            }
            resetForm();
            fetchData();
        } catch (err) { alert("Gabim!"); }
    };

    const resetForm = () => {
        setRecord({ perdoruesi_id: "", libri_id: "" });
        setIsEditing(false);
    };

    return (
        <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", marginBottom: "40px" }}>
                <h2>{isEditing ? "✏️ Edito Wishlist" : "💙 Shto në Wishlist"}</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", gap: "15px", alignItems: "flex-end" }}>
                    
                    <div style={{ flex: 1 }}>
                        <label>Përdoruesi:</label>
                        <select 
                            name="perdoruesi_id" // Emri duhet të jetë identik me state-in
                            value={record.perdoruesi_id} 
                            onChange={handleChange} // onChange lejon ndryshimin
                            required 
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                        >
                            <option value="">-- Zgjidh Përdoruesin --</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.emri} {u.mbiemri}</option>)}
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label>Libri:</label>
                        <select 
                            name="libri_id" 
                            value={record.libri_id} 
                            onChange={handleChange} 
                            required 
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                        >
                            <option value="">-- Zgjidh Librin --</option>
                            {books.map(b => <option key={b.id} value={b.id}>{b.titulli}</option>)}
                        </select>
                    </div>

                    <button type="submit" style={{ padding: "10px 25px", background: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                        {isEditing ? "UPDATE" : "SHTO"}
                    </button>
                </form>
            </div>

            {/* LISTA E WISH-AVE */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {wishlist.map(w => (
                    <div key={w.id} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", position: "relative", borderLeft: "6px solid #007bff" }}>
                        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                            <button onClick={() => { setRecord(w); setIsEditing(true); }} style={{ border: "none", background: "none", cursor: "pointer" }}>✏️</button>
                            <button onClick={async () => { if(window.confirm("Fshije?")) { await axios.delete(`http://localhost:5000/wishlists/${w.id}`); fetchData(); } }} style={{ border: "none", background: "none", cursor: "pointer" }}>🗑️</button>
                        </div>
                        <small style={{ color: "#888", fontWeight: "bold" }}>👤 {w.emri} {w.mbiemri}</small>
                        <h4 style={{ margin: "5px 0", color: "#333" }}>📖 {w.titulli}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlists;