import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, doc, getDoc, getDocs, deleteDoc, query, orderBy } from "firebase/firestore";
import AddOrderModal from "./AddOrderModal";
import EditOrderModal from "./EditOrderModal"

const Profile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setshowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('')
  const [selectBook, setSelectBook] = useState('')

  const [selectedImage, setSelectedImage] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  const [searchDocId, setSearchDocId] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersRef = collection(db, "Order");
      const ordersQuery = query(ordersRef);
      const querySnapshot = await getDocs(ordersQuery);
      const updatedOrders = [];
      let MyNewSnapshot = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          collectionId: doc.id,// Include the Firestore document ID
          ...doc.data(),
          date: docData.createdDate ? docData.createdDate.toDate() : null,
        }
      });
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
      setFilteredData(updatedOrders);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };
  const handleSave = (orderId) => {
    setEditingOrder(null);
  };
  const handleEdit = (orderId, books) => {
    setSelectedOrder(orderId)
    setSelectBook(books)
    setshowEditModal(true); // Set order to be edited
  };

  const handleCancel = () => {
    setEditingOrder(null); // Reset editing
  };
  const handleDelete = async (orderId) => {
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
  const handleCloseEditModal = () => {
    setshowEditModal(false)
  };
  const handleNewOrder = () => {
    fetchData();
  }

  const handleFilterByDocId = () => {
    if (!searchDocId.trim()) {
      setFilteredData(data); // If input is empty, show all data
    } else {
      const filteredOrders = data.filter(
        (order) => order.collectionId === searchDocId.trim() // Match the input with the Firestore doc id
      );
      setFilteredData(filteredOrders);
    }
  };

  const handleReset = () => {
    setSearchDocId('');
    setFilteredData(data); // Reset to show all orders
  };
  const downloadImages = (images) => {
   /* try {
      images.forEach(([key, url]) => {
        fetch(url,{ mode: 'no-cors' })
          .then((response) => {
            // if (!response.ok) {
            //   throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            return response.blob(); // Convert response to blob
          })
          .then((blob) => {
            const link = document.createElement("a");
            const objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl; // Create a temporary URL for the blob
            link.download = `${key}.jpeg`; // Use the key as the file name
            document.body.appendChild(link);
            link.click(); // Trigger download
            document.body.removeChild(link); // Clean up
            URL.revokeObjectURL(objectUrl); // Revoke the blob URL
          })
          .catch((error) => {
            console.error("Error downloading image:", error);
          });
      });
  
      console.log("Images downloaded successfully");
    } catch (error) {
      console.error("Error in downloadImages:", error);
    }
      */
  };
  
  
  

  return (
    <div className="pl-10 container mx-auto p-4 pl-0">
      <h1 className="text-2xl font-bold text-center mb-8">Orders</h1>
      <div className="overflow-auto">
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Enter Document ID"
            value={searchDocId}
            onChange={(e) => setSearchDocId(e.target.value)} // Update searchDocId state
            className="border border-gray-300 px-4 py-2 rounded"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleFilterByDocId} // Apply the filter
          >
            Search
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleReset} // Reset the filter
          >
            Reset
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddOrder}
          >
            Add Order
          </button>
        </div>

        {/* Add Order Modal */}
        {showEditModal && (
          <EditOrderModal orderId={selectedOrder} book={selectBook} handleNewOrder={handleNewOrder} clodeEditModal={handleCloseEditModal} />
        )}

        {showAddModal && (
          <AddOrderModal handleNewOrder={handleNewOrder} closeModal={handleCloseModal} />
        )}

        {filteredData.filter(item => item.status !== "Done").length === 0 ?(
          <div>No data available</div>
        ) : (
          <table className=" overflow-auto table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-xs">
                <th className="border border-gray-300 px-4 py-2">BookName</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">City</th>
                <th className="border border-gray-300 px-4 py-2">Mail</th>
                <th className="border border-gray-300 px-4 py-2">FullName</th>
               
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Payment Status</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Created Date</th>
                <th className="border border-gray-300 px-4 py-2">Note</th>
                <th className="border border-gray-300 px-4 py-2">Images</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredData.length === 0 ? (
                  <tr><td colSpan="12" className="text-center">No data available</td></tr>
                ) :
                filteredData
                .filter(item => item.status !== "Done") // ✅ Filter out items with status "done"
                .map((item, index) => {
                    //const mediaEntries = Object.entries(item.Images).filter(([key, value]) => key.startsWith('media'));
                    const Images = Object.entries(item.Images)
                    return (<tr key={`${item.id}-${index}`} className="text-xs" >
                      <td className="border border-gray-300 text-center">{item.bookTitle}</td>
                      <td className="border border-gray-300 text-center">{item.address}</td>
                      <td className="border border-gray-300 text-center">{item.city || "N/A"}</td>
                    
                      <td className="border border-gray-300 text-center">{item.mail || "N/A"}</td>
                      <td className="border border-gray-300 text-center">{item.fullName || "N/A"}</td>
                     
                      <td className="border border-gray-300 text-center">{item.status || "N/A"}</td>
                      <td className="border border-gray-300 text-center">{item.paystatus || "N/A"}</td>
                      <td className="border border-gray-300 text-center">{item.phone || "N/A"}</td>
                      <td className="border border-gray-300 text-center">
                        {item.date
                          ? `${item.date.toLocaleDateString("en-US")} ${item.date.toLocaleTimeString("en-US")}`
                          : "No Date"}
                      </td>
                       <td  title={item.note || "N/A"} className="text-center border border-gray-300 max-w-[150px] truncate whitespace-nowrap overflow-hidden">{item.note || "N/A"}</td>
                      <td className="border min-w-3 border-gray-300">
                        <div className="grid grid-cols-2 gap-2">   {Images.map(([key, value]) => (
                          <img
                            key={key}
                            src={value}
                            alt={`UserImage ${key + 1}`}
                            className="cursor-pointer w-16 h-16 object-cover rounded "
                            onClick={() => setSelectedImage(value)}
                          />

                        ))} </div>
                      </td>
                      {editingOrder === item.doc_id ? (
                        <td className="border border-gray-300 px-4 py-2">
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
                        <td className="border border-gray-300 p-2">
                           <div className="flex flex-col justify-center items-start gap-2">       
                          <button
                            className="text-blue-500 hover:underline px-4 py-2 bg-blue-100 rounded w-full"
                            onClick={() => handleEdit(item.collectionId, item.doc_id)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500 hover:underline px-4 py-2 bg-red-100 rounded w-full"
                            onClick={() => handleDelete(item.collectionId)}
                          >
                            Delete
                          </button>

                          <button
                            className="text-green-500 hover:underline px-4 py-2 bg-green-100 rounded w-full"
                            onClick={() => downloadImages(Images)}
                          >
                            Download
                          </button>
                          </div>
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
            <img src={selectedImage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
