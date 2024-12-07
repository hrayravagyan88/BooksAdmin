import React, { useState, useEffect } from "react";
import { db ,storage} from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editBook, setEditBook] = useState(null); // Book being edited
  const [imageFiles, setImageFiles] = useState([]); // For secondary images
  const [mainImageFile, setMainImageFile] = useState(null); // For main image

  const booksCollection = collection(db, "books");

  // Fetch All Books
  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDocs(booksCollection);
      const booksList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksList);
    } catch (err) {
      setError("Failed to fetch books.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const deleteBook = async (id)=>{
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const bookDoc = doc(db, "books", id);
        await deleteDoc(bookDoc);
        fetchBooks(); // Refresh the list after deletion
      } catch (err) {
        setError("Failed to delete book.");
        console.error(err);
      }
    }  }

  const updateBook = async () => {
    if (!editBook.title || !editBook.description2 || !editBook.description1) {
      setError("All fields are required.");
      return;
    }

    try {
      // Upload main image if updated
      let updatedMainImage = editBook.mainImage;
      if (mainImageFile) {
        const mainImageRef = ref(storage, `books/${editBook.id}/mainImage`);
        await uploadBytes(mainImageRef, mainImageFile);
        updatedMainImage = await getDownloadURL(mainImageRef);
      }

      // Upload secondary images if updated
      const updatedImages = editBook.images;
      for (let i = 0; i < imageFiles.length; i++) {
        if (imageFiles[i]) {
          const imageRef = ref(storage, `books/${editBook.id}/image${i + 1}`);
          await uploadBytes(imageRef, imageFiles[i]);
          const imageUrl = await getDownloadURL(imageRef);
          updatedImages.push(imageUrl);
        } else {
          updatedImages.push(editBook.images[i]); // Keep existing image if not updated
        }
      }

      const bookDoc = doc(db, "books", editBook.id);
      console.log(bookDoc,editBook )
      await updateDoc(bookDoc, {
        title: editBook.title,
        description2: editBook.description2,
        description1: editBook.description1,
        mainImage: updatedMainImage,
        images: updatedImages,
      });

      setEditBook(null); // Exit edit mode
      setImageFiles([]); // Reset image files
      setMainImageFile(null); // Reset main image file
      fetchBooks(); // Refresh the books list
    } catch (err) {
      setError("Failed to update book.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto p-4 pl-0">
      <h1 className="text-3xl font-bold mb-6">Edit Books</h1>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white shadow rounded-lg p-4">
              {editBook && editBook.id === book.id ? (
                // Edit Form
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={editBook.title}
                    onChange={(e) =>
                      setEditBook({ ...editBook, title: e.target.value })
                    }
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <textarea
                    placeholder="Short Description"
                    value={editBook.description2}
                    onChange={(e) =>
                      setEditBook({
                        ...editBook,
                        description2: e.target.value,
                      })
                    }
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <textarea
                    placeholder="Long Description"
                    value={editBook.description1}
                    onChange={(e) =>
                      setEditBook({
                        ...editBook,
                        description1: e.target.value,
                      })
                    }
                    className="w-full mb-2 p-2 border rounded"
                  />

                  <label className="block mb-1">Main Image</label>
                  <input
                    type="file"
                    onChange={(e) => setMainImageFile(e.target.files[0])}
                    className="w-full p-1 border rounded"
                  />
                  {editBook.mainImage && (
                    <img
                      src={editBook.mainImage}
                      alt="Main"
                      className="w-full mt-2 h-32 object-cover"
                    />
                  )}

                  <label className="block mt-4 mb-1">Secondary Images</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i}>
                        <input
                          type="file"
                          onChange={(e) => {
                            const newFiles = [...imageFiles];
                            newFiles[i] = e.target.files[0];
                            setImageFiles(newFiles);
                          }}
                          className="w-full p-1 border rounded"
                        />
                        {editBook.images[i] && (
                          <img
                            src={editBook.images[i]}
                            alt={`Secondary ${i + 1}`}
                            className="w-full mt-2 h-32 object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={updateBook}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditBook(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Book Details
                <div>
                  <h2 className="text-xl font-bold">{book.title}</h2>
                  <p className="text-sm text-gray-700 mt-2">
                    {book.description2}
                  </p>
                  <img
                    src={book.mainImage}
                    alt="Main"
                    className="w-full mt-4 h-32 object-cover"
                  />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {book.images &&
                      book.images.map((image, i) => (
                        <img
                          key={i}
                          src={image}
                          alt={`Secondary ${i + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      ))}
                  </div>
                  <div className="flex flex-row justify-between">
                  <button
                    onClick={() => setEditBook(book)}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={()=>deleteBook(book.id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                  >
                    delete
                  </button>
                </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
