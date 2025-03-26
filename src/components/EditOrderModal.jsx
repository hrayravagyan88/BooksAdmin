import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase"; // Your Firebase config file
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc } from "firebase/firestore";


const EditOrderModal = ({ orderId, book, clodeEditModal, handleNewOrder }) => {
  const [orderData, setOrderData] = useState({
    address: "",
    city: "",
    doc_id: "",
    fullName: "",
    granny_name: "",
    mail: "",
    note: "",
    status: '',
    phone: "",
    paystatus:"",
    cName:''
  });
  const [cities] = useState(["Երևան", "Գյումրի", "Կապան", "Վանաձոր", "Աբովյան", "Սևան", "Հրազդան", "Չարենցավան", "Արարատ", "Վաղարշապատ", "Գորիս", "Աշտարակ", "Սիսիան"]);
  const [statuses]=  useState(["New", "In Painting","In Printing", "Done"]);
  const [paymentStatuses]=  useState(["Not Paid", "Paid", "Partially Paid"]) 
  const [books, setBooks] = useState([]); // Books dropdown
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch books from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderDoc = doc(db, "Order", orderId);
        const docSnap = await getDoc(orderDoc)
        if (docSnap.exists()) {
          const data = docSnap.data();
          const imageUrls = Object.values(data.Images)
          //.filter((key) => key.startsWith("media-")) // Filter keys starting with 'media-'
          //.map((key) => data[key]);

          setImageFiles(imageUrls)

          setOrderData({
            address: data.address || "",
            city: data.city || "",
            doc_id: book, // The document ID from Firestore
            fullName: data.fullName || "",
            granny_name: data.granny_name || "",
            mail: data.mail || "",
            note: data.note || "",
            phone: data.phone || "",
            status: data.status || statuses[0],
            paystatus:data.paystatus ||paymentStatuses[0],
            cName:data.cName|| '',
          });
        }
        const bookRef = collection(db, "books");
        const bookSnapshot = await getDocs(bookRef);
        const bookList = bookSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }));
        setBooks(bookList);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const uploadImages = async () => {
    const imageURLs = [];
    for (const file of imageFiles) {
      if (typeof file === "string") {
        imageURLs.push(file);
      } else {
        const storageRef = ref(storage, `orders/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageURLs.push(downloadURL);
      }
    }
    return imageURLs;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedImages = await uploadImages();
      const result = uploadedImages.reduce((acc, downloadURL) => {
        acc[`media-${uuidv4()}`] = downloadURL;
        return acc;
      }, {});

      const order = { ...orderData, Images: result };
      const docRef = doc(db, 'Order', orderId);

      await updateDoc(docRef, order);
      alert("Order added successfully!");
      clodeEditModal();
      handleNewOrder();
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Failed to add order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-lg p-6">
        <h2 className="text-xl font-bold mb-1">Edit an Order</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={orderData.fullName}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
              required
            />
          </div>


          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              name="cName"
              value={orderData.cName || ''}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
              required
            />
          </div>

          {/* Granny Name */}
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Granny Name</label>
            <input
              type="text"
              name="granny_name"
              value={orderData.granny_name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Note</label>
            <textarea
              type="text"
              name="note"
              value={orderData.note}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>

          {/* Email */}
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="mail"
              value={orderData.mail}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
              required
            />
          </div>
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={orderData.phone}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
              required
            />
          </div>
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">City</label>
            <select
              name="city"
              value={orderData.city}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
              required
            >
              <option value="" disabled>
                Select a city
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={orderData.status}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
              required
            >
              <option value="" disabled>
                Select a status
              </option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select
              name="paystatus"
              value={orderData.paystatus}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
              required
            >
              <option value="" disabled>
                Select a status
              </option>
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Book Dropdown */}
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Select Book</label>
            <select
              name="doc_id"
              value={orderData.doc_id}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
              required
            >
              <option value="" disabled>
                Choose a book
              </option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
          {/* Address */}
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={orderData.address}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-1"
              required
            />
          </div>

          <div className="flex gap-4">
            {imageFiles.map(val => {
              return <img width="60" height="60" src={typeof val === "string" ? val : URL.createObjectURL(val)} />
            })}
          </div>

          {/* Image upload */}
          <div className="mb-1">
            <label className="block text-sm font-medium mb-1">Upload Images (4)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded px-3 py-1"

            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-1 rounded mr-2"
              onClick={clodeEditModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded"
              disabled={loading}
            >
              {loading ? "Editing..." : "Edit  Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
