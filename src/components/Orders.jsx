import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, doc, getDoc, getDocs ,deleteDoc} from "firebase/firestore";
import AddOrderModal from "./AddOrderModal";

const Profile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const collectionName = 'Order'
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const updatedOrders = [];
      let MyNewSnapshot = querySnapshot.docs.map((doc) => ({
        collectionId: doc.id, // Include the Firestore document ID
        ...doc.data(),
      }));
  
      for (const orderDoc of MyNewSnapshot) {
        const orderData = orderDoc
        const bookId = orderData.doc_id;
        if (bookId) {

          const bookDocRef = doc(db, "books", bookId);
          const bookDocSnap = await getDoc(bookDocRef);
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleSave = (orderId) => {
    // Save logic here - Update Firebase with new values
    // Then reset editing state
    setEditingOrder(null);
  };
  const handleEdit = (orderId) => {
    console.log(orderId)
    setEditingOrder(orderId); // Set order to be edited
  };

  const handleCancel = () => {
    setEditingOrder(null); // Reset editing
  };
  const handleDelete = async (orderId) => {
    console.log(orderId)
   const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
       await deleteDoc(doc(db, "Order", orderId)); 
       fetchData(); 
    }
       
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleAddOrder = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };
  const handleNewOrder = ()=>{
    fetchData();
  }
  return (
    <div className="pl-10 container mx-auto p-4 pl-0">
      <h1 className="text-2xl font-bold text-center mb-8">Orders</h1>
      <div className="overflow-auto">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddOrder}
      >
        Add Order
      </button>

      {/* Add Order Modal */}
      {showAddModal && (
        <AddOrderModal handleNewOrder={handleNewOrder}  closeModal={handleCloseModal} />
      )}
        {data.length === 0 ? (
          <div>No data available</div>
        ) : (
          <table className=" overflow-auto table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-xs">

                <th className="border border-gray-300 px-4 py-2">BookName</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">City</th>
                <th className="border border-gray-300 px-4 py-2">DeLivery</th>
                <th className="border border-gray-300 px-4 py-2">Mail</th>
                <th className="border border-gray-300 px-4 py-2">FullName</th>
                <th className="border border-gray-300 px-4 py-2">Note</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Images</th>
                <th  className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const mediaEntries = Object.entries(item).filter(([key, value]) => key.startsWith('media'));
                return (<tr className="text-xs" key={item.id}>
                  <td className="border border-gray-300 px-4 py-2">{item.bookTitle}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.address}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.city || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.delivery ? "Yes" : "NO"}</td>
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
                  {editingOrder === item.doc_id ? (
                    <td  className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                        onClick={() => handleSave(item.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded ml-2"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </td>
                  ) : (
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="h-[32px] bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                        onClick={() => handleEdit(item.doc_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="h-[32px] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleDelete(item.collectionId)}
                      >
                        Delete
                      </button>
                    </td>
                  )}

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

          </div>
          
        )}
      </div>
    </div>
  );
};

export default Profile;