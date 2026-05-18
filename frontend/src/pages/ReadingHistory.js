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
    statusi: "duke e lexuar",
  });

  const fetchData = async () => {
    try {
      const [resU, resB, resH] = await Promise.all([
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/books"),
        axios.get("http://localhost:5000/reading-history"),
      ]);

      const usersData = resU.data || [];
      const booksData = resB.data || [];
      const historyData = resH.data || [];

      // Ensure display names even if backend JOIN isn't present
      const mappedHistory = historyData.map((h) => {
        const user = usersData.find((u) => u.id === h.perdoruesi_id);
        const book = booksData.find((b) => b.id === h.libri_id);

        return {
          ...h,
          emri: h.emri || (user ? user.emri : ""),
          mbiemri: h.mbiemri || (user ? user.mbiemri : ""),
          libri_titulli:
            h.libri_titulli || h.titulli || (book ? book.titulli : ""),
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

  const calcPercent = (faqja, libriId) => {
    const libri = books.find((b) => Number(b.id) === Number(libriId));
    if (!libri || !libri.numri_faqeve || libri.numri_faqeve <= 0) return 0;
    return Math.min(Math.round((faqja / libri.numri_faqeve) * 100), 100);
  };

  const handleFaqjaChange = (val, libriId) => {
    const faqja = parseInt(val, 10) || 0;
    const id = libriId != null ? libriId : record.libri_id;
    const perqindja = calcPercent(faqja, id);

    setRecord((prev) => ({
      ...prev,
      faqja_aktuale: faqja,
      perqindja_leximit: perqindja,
      statusi: perqindja === 100 ? "completed" : "duke e lexuar",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!record.perdoruesi_id || !record.libri_id)
      return alert("Zgjidhni përdoruesin dhe librin!");

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/reading-history/${record.id}`,
          record,
        );
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
    setRecord({
      perdoruesi_id: "",
      libri_id: "",
      faqja_aktuale: "",
      perqindja_leximit: 0,
      statusi: "duke e lexuar",
    });
    setIsEditing(false);
  };

  const handleEdit = (h) => {
    setRecord({
      ...h,
      faqja_aktuale: h.faqja_aktuale ?? "",
      perqindja_leximit: h.perqindja_leximit ?? 0,
      statusi: h.statusi ?? "duke e lexuar",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredHistory = history.filter((h) => {
    const emri = (h.emri || "").toLowerCase();
    const mbiemri = (h.mbiemri || "").toLowerCase();
    const titulli = (h.libri_titulli || "").toLowerCase();
    const kerkimi = searchTerm.toLowerCase();
    return (
      emri.includes(kerkimi) ||
      mbiemri.includes(kerkimi) ||
      titulli.includes(kerkimi)
    );
  });

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {isEditing ? "Edit Reading Progress" : "Add New Reading History"}
            </div>
            <div className="cardSubtitle">
              Track user reading progress per book
            </div>
          </div>
          <div className="help">
            {isEditing
              ? "Editing an existing entry"
              : "Create a new reading history record"}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="formGrid"
        >
          <div className="field">
            <label className="label">Përdoruesi</label>
            <select
              className="select"
              value={record.perdoruesi_id}
              onChange={(e) =>
                setRecord({ ...record, perdoruesi_id: e.target.value })
              }
              required
            >
              <option value="">-- Zgjidh Përdoruesin --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.emri} {u.mbiemri}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Libri</label>
            <select
              className="select"
              value={record.libri_id}
              onChange={(e) => {
                const id = e.target.value;
                setRecord((prev) => ({ ...prev, libri_id: id }));
                handleFaqjaChange(record.faqja_aktuale, id);
              }}
              required
            >
              <option value="">-- Zgjidh Librin --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.titulli} ({b.numri_faqeve} fq)
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Faqja Aktuale</label>
            <input
              className="input"
              type="number"
              value={record.faqja_aktuale}
              onChange={(e) => handleFaqjaChange(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Përqindja</label>
            <div
              className="help"
              style={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}
            >
              {record.perqindja_leximit}%
            </div>
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {isEditing ? "PËRDITËSO" : "RUAJ HISTORINË"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btnGhost"
                onClick={resetForm}
              >
                Anulo
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <div className="cardTitle">Historia e Leximit</div>
            <div className="cardSubtitle">
              Search by user name or book title
            </div>
          </div>
          <input
            className="input"
            style={{ maxWidth: 340, borderRadius: 999 }}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredHistory.length === 0 ? (
          <div className="cardTight" style={{ textAlign: "center" }}>
            <div
              className="cardTitle"
              style={{ fontSize: 18, marginBottom: 8 }}
            >
              Nuk u gjet asnjë histori
            </div>
            <div className="help">
              Shto një histori leximi për të parë rezultatet këtu.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 14,
            }}
          >
            {filteredHistory.map((h) => {
              const isCompleted = h.statusi === "completed";
              const cover = h.foto_kopertines;
              return (
                <div
                  key={h.id}
                  className="card"
                  style={{ overflow: "hidden", borderRadius: 12 }}
                >
                  {cover ? (
                    <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
                      <img src={cover} alt={h.libri_titulli} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                  ) : (
                    <div style={{ width: "100%", height: 260, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 600, fontSize: 13 }}>No cover</div>
                  )}
                  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", marginBottom: 2 }}>{h.emri} {h.mbiemri}</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{h.libri_titulli}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button type="button" className="btn btnGhost" onClick={() => handleEdit(h)}>Edit</button>
                        <button type="button" className="btn btnGhost" onClick={async () => { if (await window.confirm("A jeni i sigurt?")) { await axios.delete(`http://localhost:5000/reading-history/${h.id}`); fetchData(); } }}>Delete</button>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 1 }}>Progress</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: isCompleted ? "#16a34a" : "#2563eb" }}>{h.perqindja_leximit}%</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 1 }}>Page</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{h.faqja_aktuale}</div>
                      </div>
                    </div>

                    <div style={{ width: "100%", height: 6, background: "rgba(15,23,42,0.08)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: `${h.perqindja_leximit}%`, height: "100%", background: isCompleted ? "#16a34a" : "#1d4ed8", borderRadius: 999, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingHistory;
