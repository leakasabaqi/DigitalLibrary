// import { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AdminLayout from "./admin/AdminLayout";

// import AddAuthor from "./pages/addAuthor";
// import AddBook from "./pages/addBook";
// import AddCategory from "./pages/addCategory";
// import AddUser from "./pages/addUser";
// import AddPlan from "./pages/addPlan";
// import AddSubscription from "./pages/addSubscription";
// import ReadingHistory from "./pages/ReadingHistory";
// import Reviews from "./pages/Reviews";
// import Wishlists from "./pages/Wishlists";
// import Collections from "./pages/Collections";
// import CollectionBooks from "./pages/CollectionBooks";
// import Bookmarks from "./pages/Bookmarks";
// import BookRequests from "./pages/BookRequests";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// const DashboardHome = ({ books }) => {
//   return (
//     <div className="card" style={{ padding: 18 }}>
//       <div className="cardHeader" style={{ marginBottom: 12 }}>
//         <div>
//           <div className="cardTitle">Library Overview</div>
//           <div className="cardSubtitle">Key statistics for your catalog</div>
//         </div>
//       </div>

//       <div
//         className="formGrid"
//         style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
//       >
//         <div
//           className="cardTight"
//           style={{
//             background: "#fff",
//             border: "1px solid rgba(15,23,42,0.10)",
//           }}
//         >
//           <div style={{ fontWeight: 900, fontSize: 26 }}>{books.length}</div>
//           <div className="help" style={{ fontSize: 12 }}>
//             Total Books
//           </div>
//         </div>
//         <div
//           className="cardTight"
//           style={{
//             background: "#fff",
//             border: "1px solid rgba(15,23,42,0.10)",
//           }}
//         >
//           <div style={{ fontWeight: 900, fontSize: 26 }}>—</div>
//           <div className="help" style={{ fontSize: 12 }}>
//             Digital Library
//           </div>
//         </div>
//         <div
//           className="cardTight"
//           style={{
//             background: "#fff",
//             border: "1px solid rgba(15,23,42,0.10)",
//           }}
//         >
//           <div style={{ fontWeight: 900, fontSize: 26 }}>—</div>
//           <div className="help" style={{ fontSize: 12 }}>
//             Fast Access
//           </div>
//         </div>
//       </div>

//       <div className="hr" />

//       <div
//         style={{
//           display: "flex",
//           alignItems: "baseline",
//           justifyContent: "space-between",
//           gap: 12,
//         }}
//       >
//         <div>
//           <div
//             className="cardTitle"
//             style={{
//               fontSize: 14,
//               letterSpacing: ".02em",
//               textTransform: "uppercase",
//             }}
//           >
//             Recent Books
//           </div>
//           <div className="cardSubtitle" style={{ marginTop: 6 }}>
//             Latest entries added to the system
//           </div>
//         </div>
//       </div>

//       {books.length === 0 ? (
//         <div style={{ marginTop: 18, color: "var(--muted)", fontWeight: 700 }}>
//           No books in the database yet.
//         </div>
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//             gap: 12,
//             marginTop: 14,
//           }}
//         >
//           {books.slice(0, 6).map((book) => (
//             <div
//               key={book.id}
//               className="cardTight"
//               style={{
//                 background: "#fff",
//                 border: "1px solid rgba(15,23,42,0.10)",
//               }}
//             >
//               <div
//                 style={{
//                   fontWeight: 900,
//                   marginBottom: 6,
//                   lineHeight: 1.3,
//                   fontSize: 14,
//                 }}
//               >
//                 {book.titulli}
//               </div>
//               <div className="help" style={{ fontSize: 12 }}>
//                 {book.emri} {book.mbiemri}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// function App() {
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/books")
//       .then((res) => res.json())
//       .then((data) => setBooks(Array.isArray(data) ? data : []))
//       .catch((err) => console.log("ERROR:", err));
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <AdminLayout
//               pageTitle="Dashboard"
//               pageSubtitle="Admin panel overview"
//             >
//               <DashboardHome books={books} />
//               <div className="card" style={{ marginTop: 14 }}>
//                 <AddBook />
//               </div>
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/authors"
//           element={
//             <AdminLayout
//               pageTitle="Authors"
//               pageSubtitle="Create and manage author profiles"
//             >
//               <AddAuthor />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/categories"
//           element={
//             <AdminLayout
//               pageTitle="Categories"
//               pageSubtitle="Organize books by category hierarchy"
//             >
//               <AddCategory />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/users"
//           element={
//             <AdminLayout pageTitle="Users" pageSubtitle="Manage user accounts">
//               <AddUser />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/plans"
//           element={
//             <AdminLayout
//               pageTitle="Subscription Plans"
//               pageSubtitle="Set pricing and access limits"
//             >
//               <AddPlan />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/subscriptions"
//           element={
//             <AdminLayout
//               pageTitle="Subscriptions"
//               pageSubtitle="Track user subscription status"
//             >
//               <AddSubscription />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/history"
//           element={
//             <AdminLayout
//               pageTitle="Reading History"
//               pageSubtitle="Monitor reading progress"
//             >
//               <ReadingHistory />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/reviews"
//           element={
//             <AdminLayout
//               pageTitle="Reviews"
//               pageSubtitle="Manage user reviews for books"
//             >
//               <Reviews />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/wishlist"
//           element={
//             <AdminLayout pageTitle="Wishlists" pageSubtitle="Manage wishlists">
//               <Wishlists />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/collections"
//           element={
//             <AdminLayout
//               pageTitle="Collections"
//               pageSubtitle="Create and manage collections"
//             >
//               <Collections />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/collectionbooks"
//           element={
//             <AdminLayout
//               pageTitle="Collection Books"
//               pageSubtitle="Assign books to collections"
//             >
//               <CollectionBooks />
//             </AdminLayout>
//           }
//         />

//         <Route
//           path="/bookmarks"
//           element={
//             <AdminLayout
//               pageTitle="Bookmarks"
//               pageSubtitle="Manage user bookmarks"
//             >
//               <Bookmarks />
//             </AdminLayout>
//           }
//         />

//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route
//           path="/requests"
//           element={
//             <AdminLayout
//               pageTitle="Book Requests"
//               pageSubtitle="Handle book request workflow"
//             >
//               <BookRequests />
//             </AdminLayout>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";

import AddAuthor from "./pages/addAuthor";
import AddBook from "./pages/addBook";
import AddCategory from "./pages/addCategory";
import AddUser from "./pages/addUser";
import AddPlan from "./pages/addPlan";
import AddSubscription from "./pages/addSubscription";
import ReadingHistory from "./pages/ReadingHistory";
import Reviews from "./pages/Reviews";
import Wishlists from "./pages/Wishlists";
import Collections from "./pages/Collections";
import CollectionBooks from "./pages/CollectionBooks";
import Bookmarks from "./pages/Bookmarks";
import BookRequests from "./pages/BookRequests";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";

// Komponenti per te mbrojtur rruget e Adminit
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.roli !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Komponenti per te mbrojtur rruget e User-it te thjeshte
const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RootRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.roli === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (user) {
    return <Navigate to="/user-profile" replace />;
  }

  return <Navigate to="/login" replace />;
};

const DashboardHome = ({ books }) => {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="cardHeader" style={{ marginBottom: 12 }}>
        <div>
          <div className="cardTitle">Library Overview</div>
          <div className="cardSubtitle">Key statistics for your catalog</div>
        </div>
      </div>

      <div
        className="formGrid"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        <div
          className="cardTight"
          style={{
            background: "#fff",
            border: "1px solid rgba(15,23,42,0.10)",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 26 }}>{books.length}</div>
          <div className="help" style={{ fontSize: 12 }}>
            Total Books
          </div>
        </div>
        <div
          className="cardTight"
          style={{
            background: "#fff",
            border: "1px solid rgba(15,23,42,0.10)",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 26 }}>—</div>
          <div className="help" style={{ fontSize: 12 }}>
            Digital Library
          </div>
        </div>
        <div
          className="cardTight"
          style={{
            background: "#fff",
            border: "1px solid rgba(15,23,42,0.10)",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 26 }}>—</div>
          <div className="help" style={{ fontSize: 12 }}>
            Fast Access
          </div>
        </div>
      </div>

      <div className="hr" />

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            className="cardTitle"
            style={{
              fontSize: 14,
              letterSpacing: ".02em",
              textTransform: "uppercase",
            }}
          >
            Recent Books
          </div>
          <div className="cardSubtitle" style={{ marginTop: 6 }}>
            Latest entries added to the system
          </div>
        </div>
      </div>

      {books.length === 0 ? (
        <div style={{ marginTop: 18, color: "var(--muted)", fontWeight: 700 }}>
          No books in the database yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
            marginTop: 14,
          }}
        >
          {books.slice(0, 6).map((book) => (
            <div
              key={book.id}
              className="cardTight"
              style={{
                background: "#fff",
                border: "1px solid rgba(15,23,42,0.10)",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  marginBottom: 6,
                  lineHeight: 1.3,
                  fontSize: 14,
                }}
              >
                {book.titulli}
              </div>
              <div className="help" style={{ fontSize: 12 }}>
                {book.emri} {book.mbiemri}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch((err) => console.log("ERROR:", err));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rruget publike */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard-i kryesor i Adminit */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminLayout
                pageTitle="Dashboard"
                pageSubtitle="Admin panel overview"
              >
                <DashboardHome books={books} />
                <div className="card" style={{ marginTop: 14 }}>
                  <AddBook />
                </div>
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/user-profile"
          element={
            <UserRoute>
              <UserProfile />
            </UserRoute>
          }
        />

        <Route
          path="/authors"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Authors">
                <AddAuthor />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Categories">
                <AddCategory />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Users">
                <AddUser />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Plans">
                <AddPlan />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Subscriptions">
                <AddSubscription />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/history"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="History">
                <ReadingHistory />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Reviews">
                <Reviews />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Wishlists">
                <Wishlists />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/collections"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Collections">
                <Collections />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/collectionbooks"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Collection Books">
                <CollectionBooks />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Bookmarks">
                <Bookmarks />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <AdminRoute>
              <AdminLayout pageTitle="Requests">
                <BookRequests />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* Ridrejtimi automatik nese hapet root "/" */}
        <Route path="/" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
