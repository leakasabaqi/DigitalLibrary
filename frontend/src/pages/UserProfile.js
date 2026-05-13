import React, { useState, useEffect } from "react";
import axios from "axios";
import UserLayout from "../admin/UserLayout";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    emri: "",
    mbiemri: "",
    username: "",
    email: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchUserData(storedUser.id);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      // Fetch currently reading books
      const booksRes = await axios.get(
        `http://localhost:5000/currently-reading/${userId}`,
      );
      setCurrentlyReading(booksRes.data || []);

      // Fetch user wishlist
      const wishlistRes = await axios.get(
        `http://localhost:5000/wishlists/${userId}`,
      );
      setWishlist(wishlistRes.data || []);

      // Fetch reading history
      const historyRes = await axios.get(
        `http://localhost:5000/reading-history/${userId}`,
      );
      setReadingHistory(historyRes.data || []);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      emri: user.emri || "",
      mbiemri: user.mbiemri || "",
      username: user.username || "",
      email: user.email || "",
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (
      !editForm.emri ||
      !editForm.mbiemri ||
      !editForm.username ||
      !editForm.email
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setEditLoading(true);
      const response = await axios.put(
        `http://localhost:5000/users/${user.id}`,
        {
          emri: editForm.emri,
          mbiemri: editForm.mbiemri,
          username: editForm.username,
          email: editForm.email,
        },
      );

      // Update local storage and state
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleBrowseBooks = () => {
    // Navigate to books page or open modal - for now just alert
    alert("Browse Books feature coming soon!");
  };

  const cardStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: 24,
    marginBottom: 24,
  };

  const sectionTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: 20,
    color: "var(--text)",
  };

  const bookGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 16,
    marginTop: 16,
  };

  const bookCardStyle = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  return (
    <UserLayout
      pageTitle="My Profile"
      pageSubtitle="View and manage your personal information"
    >
      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <p>Loading your profile...</p>
        </div>
      ) : (
        <div>
          {/* Profile Info Card */}
          {user && (
            <div style={cardStyle}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px 1fr",
                  gap: 32,
                  alignItems: "start",
                }}
              >
                {/* Profile Picture Placeholder */}
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "3rem",
                    fontWeight: 700,
                  }}
                >
                  {user.emri?.charAt(0).toUpperCase()}
                </div>

                {/* Profile Details */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: 12,
                    }}
                  >
                    <h1 style={{ fontSize: "2rem", margin: 0 }}>
                      {user.emri} {user.mbiemri}
                    </h1>
                    <button
                      onClick={handleEditProfile}
                      style={{
                        padding: "8px 16px",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--accent)",
                        color: "white",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.background = "var(--accent-hover)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.background = "var(--accent)")
                      }
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      color: "var(--muted)",
                      fontSize: "0.95rem",
                    }}
                  >
                    <div>
                      <strong>Username:</strong> {user.username}
                    </div>
                    <div>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div>
                      <strong>Member since:</strong>{" "}
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Currently Reading Section */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Currently Reading</h2>
            {currentlyReading.length > 0 ? (
              <div style={bookGridStyle}>
                {currentlyReading.map((book) => (
                  <div key={book.id} style={bookCardStyle}>
                    <div
                      style={{
                        width: "100%",
                        height: 200,
                        background: "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.8rem",
                        textAlign: "center",
                        padding: 8,
                      }}
                    >
                      {book.title || "No Image"}
                    </div>
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {book.title}
                      </div>
                      <div
                        style={{ fontSize: "0.8rem", color: "var(--muted)" }}
                      >
                        {book.author}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Browse Books Card */}
                <div
                  onClick={handleBrowseBooks}
                  style={{
                    ...bookCardStyle,
                    border: "2px dashed var(--border)",
                    background: "var(--bg)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 200,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.background = "rgba(37,99,235,0.05)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.background = "var(--bg)";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    +
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--text)",
                      textAlign: "center",
                    }}
                  >
                    Browse Books
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--muted)" }}>
                You're not currently reading any books.
              </p>
            )}
          </div>

          {/* Wishlist Section */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>My Wishlist</h2>
            {wishlist.length > 0 ? (
              <div style={bookGridStyle}>
                {wishlist.map((book) => (
                  <div key={book.id} style={bookCardStyle}>
                    <div
                      style={{
                        width: "100%",
                        height: 200,
                        background: "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.8rem",
                        textAlign: "center",
                        padding: 8,
                      }}
                    >
                      {book.title || "No Image"}
                    </div>
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {book.title}
                      </div>
                      <div
                        style={{ fontSize: "0.8rem", color: "var(--muted)" }}
                      >
                        {book.author}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Browse Books Card */}
                <div
                  onClick={handleBrowseBooks}
                  style={{
                    ...bookCardStyle,
                    border: "2px dashed var(--border)",
                    background: "var(--bg)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 200,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.background = "rgba(37,99,235,0.05)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.background = "var(--bg)";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    +
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--text)",
                      textAlign: "center",
                    }}
                  >
                    Browse Books
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--muted)" }}>Your wishlist is empty.</p>
            )}
          </div>

          {/* Reading History Section */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Reading History</h2>
            {readingHistory.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                {readingHistory.map((record) => (
                  <div
                    key={record.id}
                    style={{
                      padding: 12,
                      background: "var(--bg)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{record.bookTitle}</div>
                      <div
                        style={{ fontSize: "0.85rem", color: "var(--muted)" }}
                      >
                        Read on:{" "}
                        {new Date(record.readDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)" }}>No reading history yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-sm)",
              padding: 32,
              width: "min(500px, 90vw)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: 24,
                color: "var(--text)",
              }}
            >
              Edit Profile
            </h2>

            <div style={{ display: "grid", gap: 16 }}>
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>
                  First Name
                </span>
                <input
                  type="text"
                  value={editForm.emri}
                  onChange={(e) =>
                    setEditForm({ ...editForm, emri: e.target.value })
                  }
                  style={{
                    width: "100%",
                    minHeight: 46,
                    padding: "0 14px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "#f9fafb",
                    fontSize: "0.98rem",
                    color: "var(--text)",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>
                  Last Name
                </span>
                <input
                  type="text"
                  value={editForm.mbiemri}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mbiemri: e.target.value })
                  }
                  style={{
                    width: "100%",
                    minHeight: 46,
                    padding: "0 14px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "#f9fafb",
                    fontSize: "0.98rem",
                    color: "var(--text)",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>
                  Username
                </span>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  style={{
                    width: "100%",
                    minHeight: 46,
                    padding: "0 14px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "#f9fafb",
                    fontSize: "0.98rem",
                    color: "var(--text)",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>
                  Email
                </span>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    minHeight: 46,
                    padding: "0 14px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "#f9fafb",
                    fontSize: "0.98rem",
                    color: "var(--text)",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                marginTop: 24,
              }}
            >
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={editLoading}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--accent)",
                  color: "white",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: editLoading ? "not-allowed" : "pointer",
                  opacity: editLoading ? 0.7 : 1,
                }}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
