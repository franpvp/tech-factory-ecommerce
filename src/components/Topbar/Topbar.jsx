// src/components/layout/Topbar.jsx
import "../../components/Layout/Layout.css"

const Topbar = () => {
  return (
    <header className="app-topbar">
      <div className="app-topbar__left">
        <div className="breadcrumbs">
          <span className="breadcrumbs-root">Dashboards</span>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">HRM</span>
        </div>
        <h1 className="page-title">HRM</h1>
      </div>

      <div className="app-topbar__right">
        <div className="topbar-search">
          <input type="text" placeholder="Search..." />
        </div>

        <button className="icon-btn" title="Notifications">
          🔔
          <span className="icon-badge">5</span>
        </button>

        <button className="icon-btn" title="Cart">
          🛒
          <span className="icon-badge">5</span>
        </button>

        <div className="topbar-user">
          <div className="topbar-user__avatar">T</div>
          <div className="topbar-user__info">
            <span className="topbar-user__name">Tom Phillip</span>
            <span className="topbar-user__email">tomphillip32@example.com</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;