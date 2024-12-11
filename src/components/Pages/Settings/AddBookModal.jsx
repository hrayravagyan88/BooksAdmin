import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc,Timestamp  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../../firebase";
import { v4 as uuidv4 } from 'uuid';

const AddBookModal = ({ closeModal,handleNewOrder}) => {
    const [bookDetails, setBookDetails] = useState({
        title: "",
        description1: "",
        description2: "",
        price: "",
        
      });

  const [imageFiles, setImageFiles] = useState([]);
  const [mainImage, setMainImage] = useState([]);

  const [loading, setLoading] = useState(false);

  // Fetch books from Firestore

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookDetails((prev) => ({
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
      const storageRef = ref(storage, `orders/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      imageURLs.push(downloadURL);
    }
    return imageURLs;
  };
  const handleMainImage = (e) => {
    if (e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };


  const handleSubmit = async (e) => {
    const uniqueId = uuidv4();
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = [];

      const MainimageRef = ref(storage,`books/${mainimage.name}`);
      const snapshot = await uploadBytes(MainimageRef, mainimage);
      const url = await getDownloadURL(snapshot.ref);

      for (let i = 0; i < images.length; i++) {
        const imageRef = ref(storage, `books/${images[i].name}`);
        await uploadBytes(imageRef, images[i]);
        const downloadURL = await getDownloadURL(imageRef);
        imageUrls.push(downloadURL);
      }

      // Add book details to Firestore
      await addDoc(collection(db, "books"), {
        ...bookDetails,
        price: bookDetails.price,
        id: uniqueId,
        mainImage:url,
        images: imageUrls,
      });

      alert("Book added successfully!");
      setMainImage([]);
      setBookDetails({
        title: "",
        description1: "",
        description2: "",
        price: "",
      });
      setImages([]);
      
    } catch (error) {
      console.error("Error adding book: ", error);
      alert("Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-lg p-6">
        <h2 className="text-xl font-bold mb-1">Add New Book</h2>
        <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
          <input
            type="text"
            name="title"
            className="w-full rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 shadow-sm text-gray-900 placeholder-gray-400 py-2 px-4 transition duration-300"
            value={bookDetails.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description 1:</label>
          <textarea
            className="w-full rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 shadow-sm text-gray-900 placeholder-gray-400 py-2 px-4 resize-none transition duration-300"
            rows="5"
            name="description1"
            value={bookDetails.description1}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description 2:</label>
          <textarea
            className="w-full rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:ring-2 shadow-sm text-gray-900 placeholder-gray-400 py-2 px-4 resize-none transition duration-300"
            rows="5"
            name="description2"
            value={bookDetails.description2}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            className="w-full px-4 py-2 border border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 text-gray-700"
            type="number"
            name="price"
            value={bookDetails.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Upload Main Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImage}
            required
          />
        </div>
        <div>
          <label>Upload Images (3 max):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
          />
        </div>
        <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-1 rounded mr-2"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;