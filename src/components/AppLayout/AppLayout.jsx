import React, { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  const [showSidebarPanel, setShowSidebarPanel] = useState(true);

  const toggleSidebar = () => setShowSidebarPanel(prev => !prev);

  const openSidebarPanel = () => setShowSidebarPanel(true);

  return (
    <div className="appRoot">
      <Header onToggleSidebar={toggleSidebar} />

      <div className="appBody">
        <Sidebar showPanel={showSidebarPanel} openPanel={openSidebarPanel} />
        <main className="mainContent">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;