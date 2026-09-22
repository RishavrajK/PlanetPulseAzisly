import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <svg className="navbar-brand-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#f0fdf4"/>
            <path d="M16 7C12 7 8.5 10 8 14.5C10 13 13 13.5 15 16C17 13.5 20 13 22 14.5C21.5 10 20 7 16 7Z" fill="#16a34a"/>
            <path d="M16 16C16 20 14 23 16 25C18 23 16 20 16 16Z" fill="#16a34a"/>
          </svg>
          <span>Planet<em>Pulse</em></span>
        </Link>

        {/* Nav links */}
        <div className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            id="nav-dashboard"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            id="nav-history"
          >
            History
          </NavLink>
          <Link to="/log" className="nav-log-btn" id="nav-log">
            <span>＋</span> Log Activity
          </Link>
        </div>
      </div>
    </nav>
  );
}
