import { Link, NavLink, Outlet } from "react-router-dom";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

export function App() {
  return (
    <AppErrorBoundary>
      <div className="layout">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="app-header">
          <Link className="brand" to="/">
            Movie Database
          </Link>
          <nav aria-label="Primary">
            <ul className="nav-list">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link-active" : "nav-link"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/watchlist"
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link-active" : "nav-link"
                  }
                >
                  Watchlist
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/auth"
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link-active" : "nav-link"
                  }
                >
                  Account
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </AppErrorBoundary>
  );
}
