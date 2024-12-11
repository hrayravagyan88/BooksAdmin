import React, { useState, useEffect } from "react";
import { collection, getDocs ,deleteDoc,doc} from "firebase/firestore";
import { db } from "../../../../firebase"; // Import your firebase configuration
import AddBookModal from './AddBookModal'
const BooksList = () => {
  const [books, setBooks] = useState([]); // State to hold books data
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchBooks = async () => {
    try {
      const booksCollection = collection(db, "books"); // 'books' collection in Firestore
      const booksSnapshot = await getDocs(booksCollection);
      const booksData = booksSnapshot.docs.map((doc) => ({
        collectionId: doc.id, // Document ID
        ...doc.data(), // Document Data
      }));
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    // Fetch books from Firestore
    fetchBooks();
  }, []);

  const handleDelete = async (orderId) => {
    console.log(orderId)

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
      
    );
    if (confirmDelete) {
      await deleteDoc(doc(db, "books", orderId));
      fetchBooks();
    }

  };
  const handleAddOrder = () => {
    setShowAddModal(true);
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
  };
  const handleNewOrder = () => {
    fetchData();
  }
  // Render table
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">Books Table</h2>
      <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddOrder}
        >
          Add Order
        </button>
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
            {books.map((book,index) => (
              <tr key= {`${book.id}-${index}`} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{book.title}</td>
                <td className="border border-gray-300 p-2">{book.description1}</td>
                <td className="border border-gray-300 p-2">{book.description2}</td>
                <td className="border border-gray-300 p-2">${book.price}</td>
                <td className="border border-gray-300 p-2">
                  <img
                    src={book.mainImage}
                    alt="Main"
                    className="w-16 h-16 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(book.mainImage)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="grid grid-cols-2 gap-2">
                  {book.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-8 h-8 object-cover inline-block mr-2 cursor-pointer"
                      onClick={() => setSelectedImage(image)}
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
                  <button    onClick={() => handleDelete(book.collectionId)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
       {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)} // Close modal on click
          >
            <img src = {selectedImage} />
          </div>
        )}
        {showAddModal && (
          <AddBookModal handleNewOrder={handleNewOrder} closeModal={handleCloseModal} />
        )}
    </div>
    
  );
};

export default BooksList;