// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AddBook = () => {
//   const [authors, setAuthors] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [book, setBook] = useState({
//     titulli: "",
//     autori_id: "",
//     kategoria_id: "1",
//     isbn: "",
//     viti_botimit: "",
//     gjuha: "",
//     numri_faqeve: "",
//     foto_kopertines: "",
//   });

//   useEffect(() => {
//     fetchAuthors();
//     fetchBooks();
//   }, []);

//   const fetchAuthors = () => {
//     fetch("http://localhost:5000/authors")
//       .then((res) => res.json())
//       .then((data) => {
//         // Check if data is an error object or array
//         if (Array.isArray(data)) {
//           setAuthors(data);
//         } else {
//           console.error("Expected array from authors API, got:", data);
//           setAuthors([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching authors:", error);
//         setAuthors([]);
//       });
//   };

//   const fetchBooks = () => {
//     fetch("http://localhost:5000/books")
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         // Ensure data is an array
//         if (Array.isArray(data)) {
//           setBooks(data);
//         } else {
//           console.error("Expected array from books API, got:", data);
//           setBooks([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching books:", error);
//         setBooks([]);
//       });
//   };

//   const handleChange = (e) => {
//     setBook({ ...book, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const isUpdate = book.id ? true : false;
//     const url = isUpdate
//       ? `http://localhost:5000/books/${book.id}`
//       : "http://localhost:5000/books";

//     try {
//       const response = await fetch(url, {
//         method: isUpdate ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(book),
//       });

//       if (response.ok) {
//         alert(isUpdate ? "Libri u përditësua!" : "Libri u shtua!");
//         // Zbrazim formën totalisht pas suksesit
//         setBook({
//           titulli: "",
//           autori_id: "",
//           kategoria_id: "1",
//           isbn: "",
//           viti_botimit: "",
//           gjuha: "",
//           numri_faqeve: "",
//           foto_kopertines: "",
//         });
//         fetchBooks();
//       } else {
//         const errorMsg = await response.text();
//         alert("Gabim nga serveri: " + errorMsg);
//       }
//     } catch (err) {
//       alert("Gabim lidhjeje me serverin!");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("A dëshiron ta fshish librin?")) {
//       try {
//         await axios.delete(`http://localhost:5000/books/${id}`);
//         fetchBooks();
//       } catch (err) {
//         alert("Gabim gjatë fshirjes!");
//       }
//     }
//   };

//   const handleEdit = (b) => {
//     // Kur klikon Edit, i kalojmë të gjitha të dhënat te state-i
//     setBook({ ...b });
//   };

//   return (
//     <div
//       style={{
//         padding: "20px",
//         maxWidth: "700px",
//         margin: "0 auto",
//         fontFamily: "'Poppins', sans-serif",
//         backgroundColor: "#EBD5AB",
//         minHeight: "100vh",
//       }}
//     >
//       <h2
//         style={{
//           color: "#1B211A",
//           marginBottom: "20px",
//           fontSize: "24px",
//           fontWeight: "600",
//         }}
//       >
//         {book.id ? "Edito Librin" : "Shto Libër të Ri"}
//       </h2>

//       <form
//         onSubmit={handleSubmit}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "15px",
//           marginBottom: "30px",
//           backgroundColor: "#8BAE66",
//           padding: "25px",
//           borderRadius: "12px",
//           boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//         }}
//       >
//         <input
//           name="titulli"
//           value={book.titulli || ""}
//           placeholder="Titulli"
//           onChange={handleChange}
//           required
//           style={{
//             padding: "10px",
//             border: "1px solid #ddd",
//             borderRadius: "4px",
//           }}
//         />

//         <select
//           name="autori_id"
//           value={book.autori_id || ""}
//           onChange={handleChange}
//           required
//           style={{
//             padding: "10px",
//             border: "1px solid #ddd",
//             borderRadius: "4px",
//           }}
//         >
//           <option value="">Zgjidh Autorin</option>
//           {Array.isArray(authors) ? (
//             authors.map((a) => (
//               <option key={a.id} value={a.id}>
//                 {a.emri} {a.mbiemri}
//               </option>
//             ))
//           ) : (
//             <option disabled>Loading authors...</option>
//           )}
//         </select>

//         <input
//           name="isbn"
//           value={book.isbn || ""}
//           placeholder="ISBN"
//           onChange={handleChange}
//           style={{
//             padding: "10px",
//             border: "1px solid #ddd",
//             borderRadius: "4px",
//           }}
//         />

//         <input
//           name="viti_botimit"
//           type="number"
//           value={book.viti_botimit || ""}
//           placeholder="Viti i botimit"
//           onChange={handleChange}
//           style={{
//             padding: "10px",
//             border: "1px solid #ddd",
//             borderRadius: "4px",
//           }}
//         />

//         <input
//           name="gjuha"
//           value={book.gjuha || ""}
//           placeholder="Gjuha"
//           onChange={handleChange}
//           style={{
//             padding: "10px",
//             border: "1px solid #ddd",
//             borderRadius: "4px",
//           }}
//         />

//         <input
//           name="numri_faqeve"
//           type="number"
//           value={book.numri_faqeve || ""}
//           placeholder="Numri i faqeve"
//           onChange={handleChange}
//           style={{
//             padding: "10px",
//             border: "1px solid #ddd",
//             borderRadius: "4px",
//           }}
//         />

//         <input
//           name="foto_kopertines"
//           value={book.foto_kopertines || ""}
//           placeholder="URL e fotos"
//           onChange={handleChange}
//           style={{
//             padding: "10px",
//             border: "1px solid #ddd",
//             borderRadius: "4px",
//           }}
//         />

//         <button
//           type="submit"
//           style={{
//             padding: "12px",
//             background: book.id ? "#628141" : "#1B211A",
//             color: "#EBD5AB",
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "16px",
//             fontWeight: "600",
//             fontFamily: "'Poppins', sans-serif",
//             transition: "all 0.3s ease",
//           }}
//         >
//           {book.id ? "Ruaj Ndryshimet" : "Ruaj Librin"}
//         </button>

//         {book.id && (
//           <button
//             type="button"
//             onClick={() =>
//               setBook({
//                 titulli: "",
//                 autori_id: "",
//                 kategoria_id: "1",
//                 isbn: "",
//                 viti_botimit: "",
//                 gjuha: "",
//                 numri_faqeve: "",
//                 foto_kopertines: "",
//               })
//             }
//             style={{
//               marginTop: "10px",
//               padding: "12px",
//               background: "#8BAE66",
//               color: "#1B211A",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontSize: "16px",
//               fontWeight: "600",
//               fontFamily: "'Poppins', sans-serif",
//               transition: "all 0.3s ease",
//             }}
//           >
//             Anulo Editimin
//           </button>
//         )}
//       </form>

//       <h3
//         style={{
//           color: "#1B211A",
//           marginBottom: "15px",
//           fontSize: "20px",
//           fontWeight: "600",
//         }}
//       >
//         Lista e Librave
//       </h3>
//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           backgroundColor: "#8BAE66",
//           borderRadius: "8px",
//           overflow: "hidden",
//           boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//         }}
//       >
//         <thead>
//           <tr style={{ background: "#628141" }}>
//             <th
//               style={{
//                 padding: "12px",
//                 color: "#EBD5AB",
//                 fontWeight: "600",
//                 fontSize: "16px",
//                 fontFamily: "'Poppins', sans-serif",
//               }}
//             >
//               Titulli
//             </th>
//             <th
//               style={{
//                 padding: "12px",
//                 color: "#EBD5AB",
//                 fontWeight: "600",
//                 fontSize: "16px",
//                 fontFamily: "'Poppins', sans-serif",
//               }}
//             >
//               Veprimet
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {books.map((b) => (
//             <tr key={b.id} style={{ backgroundColor: "#EBD5AB" }}>
//               <td
//                 style={{
//                   padding: "12px",
//                   color: "#1B211A",
//                   fontFamily: "'Poppins', sans-serif",
//                 }}
//               >
//                 {b.titulli}
//               </td>
//               <td style={{ padding: "12px" }}>
//                 <button
//                   onClick={() => handleEdit(b)}
//                   style={{
//                     marginRight: "8px",
//                     cursor: "pointer",
//                     padding: "8px 12px",
//                     background: "#628141",
//                     color: "#EBD5AB",
//                     border: "none",
//                     borderRadius: "6px",
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     fontFamily: "'Poppins', sans-serif",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(b.id)}
//                   style={{
//                     cursor: "pointer",
//                     padding: "8px 12px",
//                     background: "#1B211A",
//                     color: "#EBD5AB",
//                     border: "none",
//                     borderRadius: "6px",
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     fontFamily: "'Poppins', sans-serif",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   Fshij
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AddBook;

import React, { useEffect, useState } from "react";
import axios from "axios";

const AddBook = () => {
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    titulli: "",
    autori_id: "",
    kategoria_id: "",
    isbn: "",
    viti_botimit: "",
    gjuha: "",
    numri_faqeve: "",
    foto_kopertines: "",
  });

  useEffect(() => {
    fetchAuthors();
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.error("Error categories:", err));
  };

  const fetchAuthors = () => {
    fetch("http://localhost:5000/authors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAuthors(data);
        else setAuthors([]);
      })
      .catch((error) => console.error("Error authors:", error));
  };

  const fetchBooks = () => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBooks(data);
        else setBooks([]);
      })
      .catch((error) => console.error("Error books:", error));
  };

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...book,
      autori_id: parseInt(book.autori_id),
      kategoria_id: parseInt(book.kategoria_id),
      viti_botimit: parseInt(book.viti_botimit),
      numri_faqeve: parseInt(book.numri_faqeve),
    };

    const isUpdate = book.id ? true : false;
    const url = isUpdate
      ? `http://localhost:5000/books/${book.id}`
      : "http://localhost:5000/books";

    try {
      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert(isUpdate ? "Libri u përditësua!" : "Libri u shtua!");
        setBook({
          titulli: "",
          autori_id: "",
          kategoria_id: "",
          isbn: "",
          viti_botimit: "",
          gjuha: "",
          numri_faqeve: "",
          foto_kopertines: "",
        });
        fetchBooks();
      } else {
        const errorMsg = await response.text();
        alert("Gabim: " + errorMsg);
      }
    } catch (err) {
      alert("Gabim lidhjeje me serverin!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("A dëshiron ta fshish librin?")) {
      try {
        await axios.delete(`http://localhost:5000/books/${id}`);
        fetchBooks();
      } catch (err) {
        alert("Gabim gjatë fshirjes!");
      }
    }
  };

  const handleEdit = (b) => {
    setBook({ ...b });
  };

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <div className="cardTitle">
              {book.id ? "Edit Book" : "Add New Book"}
            </div>
            <div className="cardSubtitle">
              Manage your library catalog with a clean, consistent admin design.
            </div>
          </div>
          <div className="help">
            {book.id
              ? "Editing an existing book"
              : "Add a new book to the collection"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="formGrid">
          <div className="field">
            <label className="label">Book Title *</label>
            <input
              className="input"
              name="titulli"
              value={book.titulli || ""}
              placeholder="Enter book title"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="label">Author *</label>
            <select
              className="select"
              name="autori_id"
              value={book.autori_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select an author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.emri} {a.mbiemri}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Category *</label>
            <select
              className="select"
              name="kategoria_id"
              value={book.kategoria_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emertimi || c.emri_kategorise}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">ISBN</label>
            <input
              className="input"
              name="isbn"
              value={book.isbn || ""}
              placeholder="Enter ISBN"
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label className="label">Publication Year</label>
            <input
              className="input"
              name="viti_botimit"
              type="number"
              value={book.viti_botimit || ""}
              placeholder="Enter publication year"
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label className="label">Language</label>
            <input
              className="input"
              name="gjuha"
              value={book.gjuha || ""}
              placeholder="Enter language"
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label className="label">Number of Pages</label>
            <input
              className="input"
              name="numri_faqeve"
              type="number"
              value={book.numri_faqeve || ""}
              placeholder="Enter number of pages"
              onChange={handleChange}
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Cover Image URL</label>
            <input
              className="input"
              name="foto_kopertines"
              value={book.foto_kopertines || ""}
              placeholder="Enter cover image URL"
              onChange={handleChange}
            />
          </div>

          <div className="btnRow" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btnAccent">
              {book.id ? "Save Changes" : "Add Book"}
            </button>
            {book.id && (
              <button
                type="button"
                className="btn btnGhost"
                onClick={() =>
                  setBook({
                    titulli: "",
                    autori_id: "",
                    kategoria_id: "",
                    isbn: "",
                    viti_botimit: "",
                    gjuha: "",
                    numri_faqeve: "",
                    foto_kopertines: "",
                  })
                }
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardHeader">
          <div>
            <div className="cardTitle">Library Collection</div>
            <div className="cardSubtitle">
              Browse and manage all books in the library.
            </div>
          </div>
          <div className="help">{books.length} books</div>
        </div>

        {books.length === 0 ? (
          <div className="cardTight" style={{ textAlign: "center" }}>
            <div
              className="cardTitle"
              style={{ fontSize: 18, marginBottom: 8 }}
            >
              No books yet
            </div>
            <div className="help">
              Start building your library by adding your first book above.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 18,
            }}
          >
            {books.map((b) => (
              <div key={b.id} className="card" style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: 6,
                      }}
                    >
                      {b.titulli}
                    </div>
                    <div className="help">
                      Author: {b.emri} {b.mbiemri}
                    </div>
                    {b.isbn && <div className="help">ISBN: {b.isbn}</div>}
                  </div>

                  {b.foto_kopertines && (
                    <img
                      src={b.foto_kopertines}
                      alt="Book cover"
                      style={{
                        width: 72,
                        height: 96,
                        objectFit: "cover",
                        borderRadius: 12,
                        boxShadow: "0 4px 18px rgba(15,23,42,0.08)",
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="btn btnPrimary"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btnDanger"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBook;
