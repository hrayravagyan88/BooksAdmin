// src/components/Dashboard.js
import React, { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LeftSideBar from "./LeftSideBar";


import Orders from "./Orders"
import ContactUs from "./ContactUs";
//import BooksList from "./Pages/Settings/BooksList";
import BooksList from "./Pages/Settings/BookList";
const Dashboard = () => {
  const [currentView, setCurrentView] = useState("Orders");
  const renderView = () => {
    switch (currentView) {
      case "Orders":
        return <Orders />;
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
          <div className="bg-gray-100">
            <div className="flex p-6 pl-0 justify-center">
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;




