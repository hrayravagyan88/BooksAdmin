import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";


const Profile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [book, setBook] = useState(null);


  useEffect(() => {
    const collectionName = 'Order'
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const updatedOrders = [];
        
        // Use a for loop instead of map
        
        for (const orderDoc of querySnapshot.docs) {
          const orderData = orderDoc.data();
          const bookId = orderData.doc_id;
          if (bookId) {
            console.log(bookId,232)
            // Fetch the book details using the book_id
            const bookDocRef = doc(db, "books", bookId);
            const bookDocSnap = await getDoc(bookDocRef);
            console.log(bookDocRef,bookDocSnap)
            if (bookDocSnap.exists()) {
              const bookData = bookDocSnap.data();
              updatedOrders.push({ ...orderData, bookTitle: bookData.title });
            } else {
              updatedOrders.push({ ...orderData, bookTitle: "Unknown Book" });
            }
          } else {
            updatedOrders.push({ ...orderData, bookTitle: "No Book Assigned" });
          }
        }
        
        setData(updatedOrders);
       // console.log(111,updatedOrders)
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      console.log(userId)
     // await deleteDoc(doc(db, "users", userId)); // Replace "users" with your collection name
      //fetchUsers(); // Refresh the users list
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Orders</h1>
      <div className="overflow-auto">
      {data.length === 0 ? (
        <div>No data available</div>
      ) : (
        <table className=" overflow-auto table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-xs">
              <th className="border border-gray-300 px-4 py-2">BookName</th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">City</th>
              <th className="border border-gray-300 px-4 py-2">DeLiver</th>
              <th className="border border-gray-300 px-4 py-2">Mail</th>
              <th className="border border-gray-300 px-4 py-2">FullName</th>
              <th className="border border-gray-300 px-4 py-2">Note</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th colSpan='4' className="border border-gray-300 px-4 py-2">Images</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const mediaEntries = Object.entries(item).filter(([key, value]) => key.startsWith('media'));
              return (<tr className="text-xs" key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.bookTitle}</td>
                <td className="border border-gray-300 px-4 py-2">{item.address}</td>
                <td className="border border-gray-300 px-4 py-2">{item.city || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.delivery? "Yes" :"NO"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.mail || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.fullName || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.note || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.phone || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="grid grid-cols-2 gap-2">   {mediaEntries.map(([key, value]) => (

                    <img
                      key={key}
                      src={value}
                      alt={`UserImage ${key + 1}`}
                      className="cursor-pointer w-16 h-16 object-cover rounded"
                      onClick={() => setSelectedImage(value)}
                    />

                  ))} </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>)
            })}
          </tbody>
        </table>
      )}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)} // Close modal on click
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-screen rounded shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Profile;
