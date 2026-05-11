import { useEffect, useState } from "react";
import AddAuthor from "./pages/addAuthor";
import AddBook from "./pages/addBook";
import AddCategory from "./pages/addCategory";
import AddUser from "./pages/addUser";
import AddPlan from "./pages/addPlan";
import AddSubscription from "./pages/addSubscription";

function App() {
  const [books, setBooks] = useState([]);
  const [activeSection, setActiveSection] = useState("books");

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.log("ERROR:", err));
  }, []);

  const navigationItems = [
    { id: "books", label: "📚 Books", component: <AddBook /> },
    { id: "authors", label: "✍️ Authors", component: <AddAuthor /> },
    { id: "categories", label: "🏷️ Categories", component: <AddCategory /> },
    { id: "users", label: "👥 Users", component: <AddUser /> },
    { id: "plans", label: "💎 Plans", component: <AddPlan /> },
    { id: "subscriptions", label : "Subscriptions", component: <AddSubscription />}
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "2rem 0",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          📚 Library Management System
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            opacity: "0.9",
            fontWeight: "300",
          }}
        >
          Professional Digital Library Solution
        </p>
      </header>

      <nav
        style={{
          background: "white",
          padding: "1rem 0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor:
                  activeSection === item.id ? "#667eea" : "transparent",
                color: activeSection === item.id ? "white" : "#6c757d",
                border: "none",
                borderRadius: "50px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "'Poppins', sans-serif",
                boxShadow:
                  activeSection === item.id
                    ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                    : "none",
              }}
              onMouseOver={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = "#f8f9fa";
                }
              }}
              onMouseOut={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
            boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "600",
              color: "#2d3748",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            📊 Library Overview
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {books.length}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>
                Total Books
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                📚
              </div>
              <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>
                Digital Library
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                ⚡
              </div>
              <div style={{ fontSize: "0.9rem", opacity: "0.9" }}>
                Fast Access
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#2d3748",
                marginBottom: "1rem",
              }}
            >
              Recent Books
            </h3>
            {books.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#718096",
                  fontStyle: "italic",
                }}
              >
                No books in the database yet. Add your first book to get
                started!
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1rem",
                }}
              >
                {books.slice(0, 6).map((book) => (
                  <div
                    key={book.id}
                    style={{
                      background: "#f8f9fa",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#2d3748",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {book.titulli}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#718096",
                        margin: "0",
                      }}
                    >
                      {book.emri} {book.mbiemri}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "3rem",
            boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {navigationItems.find((item) => item.id === activeSection)?.component}
        </div>
      </main>

      <footer
        style={{
          background: "#2d3748",
          color: "white",
          padding: "2rem 0",
          textAlign: "center",
          marginTop: "4rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              opacity: "0.8",
              margin: "0",
            }}
          >
            © 2026 Library Management System.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
