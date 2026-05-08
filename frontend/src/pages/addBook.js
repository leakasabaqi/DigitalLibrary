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
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#2d3748",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          📚 Book Management
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#718096",
            fontWeight: "400",
          }}
        >
          {book.id
            ? "Edit existing book"
            : "Add new books to your library collection"}
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "2.5rem",
          marginBottom: "3rem",
          boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            color: "#2d3748",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {book.id ? "✏️ Edit Book" : "➕ Add New Book"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Book Title *
              </label>
              <input
                name="titulli"
                value={book.titulli || ""}
                placeholder="Enter book title"
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Author *
              </label>
              <select
                name="autori_id"
                value={book.autori_id || ""}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: "white",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Select an author</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.emri} {a.mbiemri}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Category *
              </label>
              <select
                name="kategoria_id"
                value={book.kategoria_id || ""}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: "white",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emertimi || c.emri_kategorise}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                ISBN
              </label>
              <input
                name="isbn"
                value={book.isbn || ""}
                placeholder="Enter ISBN"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Publication Year
              </label>
              <input
                name="viti_botimit"
                type="number"
                value={book.viti_botimit || ""}
                placeholder="Enter publication year"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Language
              </label>
              <input
                name="gjuha"
                value={book.gjuha || ""}
                placeholder="Enter language"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Number of Pages
              </label>
              <input
                name="numri_faqeve"
                type="number"
                value={book.numri_faqeve || ""}
                placeholder="Enter number of pages"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Cover Image URL
              </label>
              <input
                name="foto_kopertines"
                value={book.foto_kopertines || ""}
                placeholder="Enter cover image URL"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <button
              type="submit"
              style={{
                padding: "1rem 2rem",
                background: book.id
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                fontSize: "1rem",
                fontWeight: "600",
                fontFamily: "'Poppins', sans-serif",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                minWidth: "160px",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 6px 20px rgba(102, 126, 234, 0.6)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.4)";
              }}
            >
              {book.id ? "💾 Save Changes" : "📚 Add Book"}
            </button>

            {book.id && (
              <button
                type="button"
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
                style={{
                  padding: "1rem 2rem",
                  background: "transparent",
                  color: "#718096",
                  border: "2px solid #e2e8f0",
                  borderRadius: "50px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  fontFamily: "'Poppins', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "160px",
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.color = "#667eea";
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.color = "#718096";
                }}
              >
                ❌ Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Books List Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "2.5rem",
          boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            color: "#2d3748",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          📖 Library Collection
        </h2>

        {books.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#718096",
              background: "#f8f9fa",
              borderRadius: "12px",
              border: "2px dashed #e2e8f0",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#4a5568",
              }}
            >
              No books yet
            </h3>
            <p style={{ fontSize: "1rem" }}>
              Start building your library by adding your first book above.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {books.map((b) => (
              <div
                key={b.id}
                style={{
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  e.target.style.borderColor = "#667eea";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                  e.target.style.borderColor = "#e2e8f0";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#2d3748",
                        marginBottom: "0.5rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {b.titulli}
                    </h3>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#718096",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Author: {b.emri} {b.mbiemri}
                    </div>
                    {b.isbn && (
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "#718096",
                        }}
                      >
                        ISBN: {b.isbn}
                      </div>
                    )}
                  </div>
                  {b.foto_kopertines && (
                    <img
                      src={b.foto_kopertines}
                      alt="Book cover"
                      style={{
                        width: "60px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        marginLeft: "1rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => handleEdit(b)}
                    style={{
                      padding: "0.5rem 1rem",
                      background:
                        "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      fontFamily: "'Poppins', sans-serif",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(72, 187, 120, 0.4)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background:
                        "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      fontFamily: "'Poppins', sans-serif",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(245, 101, 101, 0.4)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    🗑️ Delete
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
