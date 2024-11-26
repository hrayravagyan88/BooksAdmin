// src/components/Dashboard.js
import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
const Dashboard = () => {
    const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
        alert("Logged out!");
  };

  return (
    <ProtectedRoute>
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
    </ProtectedRoute>
  );
};

export default Dashboard;




