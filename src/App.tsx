import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { useAuth } from "./contexts/useAuth";

export function App() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
          <div className="app-header-actions">
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

            {user ? (
              <>
                <span className="account-chip">Signed in as {user.name}</span>
                <button
                  type="button"
                  className="secondary-btn secondary-btn-inline"
                  onClick={() => {
                    signOut();
                    navigate("/");
                  }}
                >
                  Sign out
                </button>
              </>
            ) : null}
          </div>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </AppErrorBoundary>
  );
}
