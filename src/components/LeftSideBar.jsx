import React from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setCurrentView }) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
        alert("Logged out!");
    };
    return (
        <div className="top-0 left-0 h-[100vh] w-64 bg-gray-800 text-white">
            <h2 className="text-2xl font-bold p-4 border-b border-gray-600">Dashboard</h2>
            <ul className="mt-4 space-y-2">
                <li onClick={() => setCurrentView("Orders")} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Orders</li>
                <li
                    onClick={() => setCurrentView("AllBooks")} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                    Books
                </li>
                <li onClick={() => setCurrentView("ContactUs")} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Contact Us</li>
                <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                    Log Out
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
