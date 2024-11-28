import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Profile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collectionName = 'UserDetails'
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(docs);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      {data.length === 0 ? (
        <div>No data available</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">City</th>
              <th className="border border-gray-300 px-4 py-2">Deiver</th>
              <th className="border border-gray-300 px-4 py-2">Mail</th>
              <th className="border border-gray-300 px-4 py-2">FullName</th>
              <th className="border border-gray-300 px-4 py-2">Note</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Images</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const mediaEntries = Object.entries(item).filter(([key, value]) => key.startsWith('media'));
             return ( <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.address}</td>
                <td className="border border-gray-300 px-4 py-2">{item.city || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.delivery || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.mail || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.fullName || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.note || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{item.phone || "N/A"}</td>
                {mediaEntries.map(([key, value]) => (

                 <td><img src ={value}/></td>

        ))}
              </tr>)
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Profile;
