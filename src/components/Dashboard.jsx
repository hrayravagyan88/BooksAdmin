// src/components/Dashboard.js
import React, { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import LeftSideBar from "./LeftSideBar";

import Home from "./Home";
import Profile from "./Profile";
import Settings from "./Settings";
import ContactUs from "./ContactUs";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("Home");
  const renderView = () => {
    switch (currentView) {
      case "Home":
        return <Home />;
      case "Profile":
        return <Profile />;
      case "Settings":
        return <Settings />;
      case "ContactUs":
        return <ContactUs />;
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
          <div className="ml-64 flex h-full w-full bg-gray-100">
            <div className="p-6 justify-center ">

              <h1 className="text-3xl font-semibold mb-6">{currentView}</h1>
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;




