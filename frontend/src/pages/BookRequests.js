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
        statusi: "Ne Pritje",
    });

    const fetchData = async () => {
        try {
            const [resBR, resU] = await Promise.all([
                axios.get("http://localhost:5000/book-requests"),
                axios.get("http://localhost:5000/users"),
            ]);
            setRequests(resBR.data || []);
            setUsers(resU.data || []);
        } catch (err) {
            console.error("Gabim:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecord((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (item) => {
        setRecord(item);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setRecord({
            perdoruesi_id: "",
            titulli_librit: "",
            autori: "",
            statusi: "Ne Pritje",
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(
                    `http://localhost:5000/book-requests/${record.id}`,
                    record,
                );
            } else {
                await axios.post("http://localhost:5000/book-requests", {
                    ...record,
                    statusi: "Ne Pritje",
                });
            }
            resetForm();
            fetchData();
        } catch (err) {
            alert("Gabim gjatë ruajtjes!");
        }
    };

    return (
        <div style={{ padding: 18 }}>
            <div className="card">
                <div className="cardHeader">
                    <div>
                        <div className="cardTitle">
                            {isEditing ? "Edit Request" : "New Book Request"}
                        </div>
                        <div className="cardSubtitle">
                            Handle incoming book requests with a clear form.
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="formGrid"
                    style={{
                        gridTemplateColumns: isEditing
                            ? "1fr 1fr"
                            : "repeat(3, minmax(0, 1fr))",
                        gap: 18,
                    }}
                >
                    <div className="field">
                        <label className="label">User</label>
                        <select
                            className="select"
                            name="perdoruesi_id"
                            value={record.perdoruesi_id}
                            onChange={handleChange}
                            required
                            disabled={isEditing}
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
                        <label className="label">Book Title</label>
                        <input
                            className="input"
                            type="text"
                            name="titulli_librit"
                            value={record.titulli_librit}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Author</label>
                        <input
                            className="input"
                            type="text"
                            name="autori"
                            value={record.autori}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {isEditing && (
                        <div className="field" style={{ gridColumn: "1 / -1" }}>
                            <label className="label">Request Status</label>
                            <select
                                className="select"
                                name="statusi"
                                value={record.statusi}
                                onChange={handleChange}
                                required
                            >
                                <option value="Ne Pritje">Pending</option>
                                <option value="E Miratuar">Approved</option>
                                <option value="E Refuzuar">Rejected</option>
                            </select>
                        </div>
                    )}

                    <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
                        <button type="submit" className="btn btnAccent">
                            {isEditing ? "Save Changes" : "Submit Request"}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                className="btn btnGhost"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card" style={{ marginTop: 18 }}>
                <div className="cardHeader">
                    <div>
                        <div className="cardTitle">Request List</div>
                        <div className="cardSubtitle">All submitted book requests.</div>
                    </div>
                    <div className="help">{requests.length} requests</div>
                </div>

                <div className="tableWrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="th">User</th>
                                <th className="th">Requested Book</th>
                                <th className="th" style={{ textAlign: "center" }}>
                                    Status
                                </th>
                                <th className="th" style={{ textAlign: "center" }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((br) => (
                                <tr key={br.id}>
                                    <td className="td">
                                        {br.emri} {br.mbiemri}
                                    </td>
                                    <td className="td">
                                        <strong>{br.titulli_librit}</strong>
                                        <div className="help">from {br.autori}</div>
                                    </td>
                                    <td className="td" style={{ textAlign: "center" }}>
                                        <span
                                            className={`badge ${br.statusi === "E Miratuar" ? "badgeSuccess" : br.statusi === "E Refuzuar" ? "badgeDanger" : "badgeAccent"}`}
                                        >
                                            {br.statusi}
                                        </span>
                                    </td>
                                    <td className="td" style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: 8,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                className="btn btnGhost"
                                                onClick={() => handleEdit(br)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btnDanger"
                                                onClick={async () => {
                                                    if (window.confirm("Fshije?")) {
                                                        await axios.delete(
                                                            `http://localhost:5000/book-requests/${br.id}`,
                                                        );
                                                        fetchData();
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookRequests;
