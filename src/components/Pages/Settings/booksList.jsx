import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Settings = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", year: "" });
  const [editBook, setEditBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const booksCollection = collection(db, "books");

  // Fetch Books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(booksCollection);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(items);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  // Add Book
  const addBook = async () => {
    try {
      if (!newBook.title || !newBook.author || !newBook.year) {
        setError("All fields are required.");
        return;
      }
      await addDoc(booksCollection, newBook);
      setNewBook({ title: "", author: "", year: "" });
      fetchBooks(); // Refresh the list
    } catch (err) {
      console.error("Error adding book:", err);
      setError("Failed to add book.");
    }
  };

  // Update Book
  const saveUpdatedBook = async () => {
    try {
      if (!editBook.title || !editBook.author || !editBook.year) {
        setError("All fields are required for editing.");
        return;
      }
      const bookDoc = doc(db, "books", editBook.id);
      await updateDoc(bookDoc, {
        title: editBook.title,
        author: editBook.author,
        year: editBook.year,
      });
      setEditBook(null);
      fetchBooks(); // Refresh the list
    } catch (err) {
      console.error("Error updating book:", err);
      setError("Failed to update book.");
    }
  };

  // Delete Book
  const deleteBook = async (id) => {
    try {
      const bookDoc = doc(db, "books", id);
      await deleteDoc(bookDoc);
      fetchBooks(); // Refresh the list
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("Failed to delete book.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1>Admin Panel - Books</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Edit Book Form */}
      {editBook && (
        <div>
          <h2>Edit Book</h2>
          <input
            className="w-full rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 shadow-sm text-gray-900 placeholder-gray-400 py-2 px-4 transition duration-300"
            type="text"
            placeholder="Title"
            value={editBook.title}
            onChange={(e) =>
              setEditBook({ ...editBook, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Author"
            value={editBook.author}
            onChange={(e) =>
              setEditBook({ ...editBook, author: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Year"
            value={editBook.year}
            onChange={(e) => setEditBook({ ...editBook, year: e.target.value })}
          />
          <button onClick={saveUpdatedBook}>Save Changes</button>
          <button onClick={() => setEditBook(null)}>Cancel</button>
        </div>
      )}

      {/* Book List */}
      <div>
        <h2>Book List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <p>
                  <strong>{book.title}</strong> by {book.author} ({book.year})
                </p>
                <button onClick={() => setEditBook(book)}>Edit</button>
                <button onClick={() => deleteBook(book.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Settings;
