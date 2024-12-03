// src/components/Dashboard.js
import React, { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LeftSideBar from "./LeftSideBar";

import Home from "./Home";
import Profile from "./Profile"
import AddBook from "./Pages/Settings/AddBook";
import ContactUs from "./ContactUs";
import BooksList from "./Pages/Settings/BooksList";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("Home");
  const renderView = () => {
    switch (currentView) {
      case "Home":
        return <Home />;
      case "Profile":
        return <Profile />;
      case "AddBook":
        return <AddBook />;
      case "ContactUs":
        return <ContactUs />;
      case "AllBooks":
          return <BooksList />  
      default:
        return <div>Select a view from the sidebar.</div>;
    }
  };


  return (
    <ProtectedRoute>
      <div className="flex">
        <LeftSideBar setCurrentView={setCurrentView} />
        {/* Main Content */}
        <div className="main-content">
          <div className="ml-64 flex h-full w-full bg-gray-100 justify-center">
            <div className="flex p-6 justify-center">
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;




