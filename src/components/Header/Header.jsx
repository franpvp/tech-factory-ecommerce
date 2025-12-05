import React from "react";
import "./Header.css";

const Header = ({ onToggleSidebar }) => {
  const handleFullscreen = () => {
    const docElm = document.documentElement;
    if (!document.fullscreenElement) {
      docElm.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="header" aria-label="Barra superior de la aplicación">
      <div className="headerLeft">
        <a href="/" className="logo" aria-label="Ir al inicio">
          <img
            src="/assets/images/brand-logos/desktop-logo.png"
            alt="Vyzor"
            className="logoImg"
          />
        </a>

        <button
          type="button"
          className="sidebarToggle"
          aria-label="Alternar menú lateral"
          onClick={onToggleSidebar}
        >
          <span className="hamburger" />
        </button>

        <div className="searchWrapper">
          <input
            id="header-search"
            type="search"
            className="searchInput"
            placeholder="Search"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="headerRight">
        <button
          type="button"
          className="iconButton"
          aria-label="Pantalla completa"
          onClick={handleFullscreen}
        >
          <span className="iconPlaceholder">⛶</span>
        </button>

      </div>
    </header>
  );
};

export default Header;