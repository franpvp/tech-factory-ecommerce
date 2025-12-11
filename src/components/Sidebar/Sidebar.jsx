import React, { useState } from "react";
import "./Sidebar.css";
import { menuConfig } from "./menuConfig";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ showPanel, openPanel }) => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const current = menuConfig.find((m) => m.id === activeMenu);
  const navigate = useNavigate();

  const handleIconClick = (item) => {
    setActiveMenu(item.id);
    openPanel();
    if (item.route) navigate(item.route);
  };

  return (
    <div className="sidebarWrapper">
      <aside className="iconBar">
        {menuConfig.map((item) => (
          <button
            key={item.id}
            className={`iconButton ${activeMenu === item.id ? "iconActive" : ""}`}
            onClick={() => handleIconClick(item)}
          >
            <i className={item.icon}></i>
          </button>
        ))}
      </aside>

      <div className={`menuPanel ${showPanel ? "open" : "closed"}`}>
        <h2 className="panelTitle">{current.title}</h2>

        <ul className="panelList">
          {current.items.map((item) => (
            <li key={item.label}>
              <button
                className="panelButton"
                onClick={() => navigate(item.route)}
              >
                <div className="panelItemLeft">
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`badge badge${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default Sidebar;