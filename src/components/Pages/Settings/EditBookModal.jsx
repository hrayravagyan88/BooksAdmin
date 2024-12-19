import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL,getStorage } from "firebase/storage";
import { db, storage } from "../../../../firebase"; // Your Firebase config file
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc } from "firebase/firestore";
export const EditBookModal = ({ BookId, clodeEditModal, handleNewOrder }) => {
    const [bookDetails, setBookDetails] = useState({
        title: "",
        description1: "",
        description2: "",
        price: "",
        isActive:false,
        isVisibleHome:true,
        sequence:''

      });
      const [imageFiles, setImageFiles] = useState([]);
      const [mainImage, setMainImage] = useState([]);
      const [loading, setLoading] = useState(false);
      const [NewImageFile,setNewImageFile]= useState('');

      useEffect(() => {
        const fetchData = async () => {
          try {
            const orderDoc = doc(db, "books", BookId);
            const docSnap = await getDoc(orderDoc)
            if (docSnap.exists()) {
              const data = docSnap.data();
              const imageUrls = Object.values(data.images);
              const mainImageUrls = data.mainImage;
              setMainImage(mainImageUrls)
              setImageFiles(imageUrls) 
              setBookDetails({
                title: data.title || "",
                description1: data.description1 || "",
                description2: data.description2 || "",
                isActive: data.isActive || false,
                isVisibleHome: data.isVisibleHome ||false,
                price: data.price || "",
                sequence: data.sequence || "",

              });
            }
          } catch (error) {
            console.error("Error fetching books:", error);
          }
        };
        fetchData();
    }, []);
    const handleImageChange = (e) => {
        setImageFiles(Array.from(e.target.files));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

        const storage = getStorage();
        const filePath =`books/${BookId}/mainImage`;
      
        const storageRefMain = ref(storage, filePath);
        const uploadedMainImage = await uploadBytes(storageRefMain, NewImageFile);
        const url = await getDownloadURL(uploadedMainImage.ref);

        const uploadedImages = await uploadImages();

          const book = { ...bookDetails, images: uploadedImages ,mainImage: NewImageFile ? url : mainImage};
          const docRef = doc(db, 'books', BookId);
          await updateDoc(docRef, book);
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

      const uploadImages = async () => {
        const imageURLs = [];
        for (const file of imageFiles) {
          if (typeof file === "string") {
            imageURLs.push(file);
          } else {
            const storageRef = ref(storage, `books/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            imageURLs.push(downloadURL);
          }
        }
        return imageURLs;
      };
      const handleMainImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);
            setMainImage(URL.createObjectURL(file)); // Preview new image
          }
      };

      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBookDetails((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      };

      return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-lg p-6">
            <h2 className="text-xl font-bold mb-1">Edit {bookDetails.title}</h2>
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
                rows="2"
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
                rows="2"
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
              <label>Sequence (Order)::</label>
              <input
                className="w-full px-4 py-2 border border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 text-gray-700"
                type="number"
                name="sequence"
                value={bookDetails.sequence}
                onChange={handleInputChange}
                required
              />
            </div>
    
    
            <div>
              <label>Is Active:</label>
              <input
                className="ml-5 "
                type="checkbox"
                name="isActive"
                checked={bookDetails.isActive}
                onChange={handleInputChange}
              />
            </div>
    
            <div>
              <label>Is Visible Home:</label>
              <input
                className="ml-5"
                type="checkbox"
                name="isVisibleHome"
                checked={bookDetails.isVisibleHome}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-4">
             <img width="60" height="60" src={mainImage }/>
            </div> 
            <div>
              <label>Upload Main Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImage}
                
              />
            </div>
            <div className="flex gap-4">
            {imageFiles.map(val => {
              return <img  width="60" height="60" src={typeof val === "string" ? val : URL.createObjectURL(val)} />
            })}
          </div>
            <div>
              <label>Upload Images (3 max):</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                
              />
            </div>
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
                  {loading ? "Editing..." : "Edit Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
}
