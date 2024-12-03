import React, { useState } from "react";

import { db, storage } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

const AddBook = () => {
  const [bookDetails, setBookDetails] = useState({
    title: "",
    description1: "",
    description2: "",
    price: "",
  });
  const [images, setImages] = useState([]);
  const [mainimage, setMainImage] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setBookDetails({ ...bookDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
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
    <div className="container" style={{ padding: "20px" }}>
      <h1 className="text-center">Add a New Book</h1>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
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
        <button  onClick = {handleSubmit} className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Book"}
        </button>
        </div>
    </div>
  );
};

export default AddBook;
