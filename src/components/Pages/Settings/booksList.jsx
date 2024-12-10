import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase"; // Import your firebase configuration

const BooksList = () => {
  const [books, setBooks] = useState([]); // State to hold books data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch books from Firestore
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, "books"); // 'books' collection in Firestore
        const booksSnapshot = await getDocs(booksCollection);
        const booksData = booksSnapshot.docs.map((doc) => ({
          id: doc.id, // Document ID
          ...doc.data(), // Document Data
        }));
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchBooks();
  }, []);

  // Render table
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">Books Table</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Description 1</th>
              <th className="border border-gray-300 p-2">Description 2</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Main Image</th>
              <th className="border border-gray-300 p-2">Images</th>
              <th className="border border-gray-300 p-2">Is Active</th>
              <th className="border border-gray-300 p-2">Is Visible Home</th>
              <th className="border border-gray-300 p-2">Order</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{book.title}</td>
                <td className="border border-gray-300 p-2">{book.description1}</td>
                <td className="border border-gray-300 p-2">{book.description2}</td>
                <td className="border border-gray-300 p-2">${book.price}</td>
                <td className="border border-gray-300 p-2">
                  <img
                    src={book.mainImage}
                    alt="Main"
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="grid grid-cols-2 gap-2">
                  {book.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-8 h-8 object-cover inline-block mr-2"
                    />
                  ))}
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={book.isActive}
                    readOnly
                    disabled
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={book.isVisibleHome}
                    readOnly
                    disabled
                  />
                </td>
                <td className="border border-gray-300 p-2">{book.order}</td>
                <td className="border border-gray-300 p-2">
                  {/* Add Edit/Delete buttons here */}
                  <button className="text-blue-500 hover:underline mr-2">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BooksList;