import { useState, useEffect } from "react";
import { menuConfig } from "./menuConfig";
import "./Sidebar.css";

export default function MenuPanel() {
  const [active, setActive] = useState(window.activeMenu || "dashboards");

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.activeMenu !== active) {
        setActive(window.activeMenu);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [active]);

  const section = menuConfig.find(s => s.id === active);

  return (
    <div className="side-panel">
      <h2 className="panel-title">{section.title}</h2>

      <div className="menu-list">
        {section.items.map(item => (
          <button key={item.label} className={`menu-item ${item.active ? "active-item" : ""}`}>
            <div className="item-left">
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span className={`badge badge-${item.badgeColor}`}>{item.badge}</span>
            )}

            {item.children && (
              <i className="bx bx-chevron-right arrow"></i>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}