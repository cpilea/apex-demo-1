import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { config } from "../lib/config";
import { ErrorState, LoadingState } from "../components/PageStatus";

type Mode = "sign-in" | "sign-up";

type AuthLocationState = {
  message?: string;
  redirectTo?: string;
};

export function AuthPage() {
  const { user, isReady, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prompt = (location.state as AuthLocationState | null) ?? null;
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo = prompt?.redirectTo ?? "/watchlist";

  if (!isReady) {
    return <LoadingState title="Loading account" message="Checking your saved session." />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "sign-up") {
        await signUp({ name, email, password });
      } else {
        await signIn({ email, password });
      }

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't complete that request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user) {
    return (
      <section className="auth-page">
        <div className="section-copy">
          <h1 className="home-title">Account</h1>
          <p className="home-subtitle">
            Signed in with {config.authProviderLabel}. Your watchlist and reviews stay scoped to your account.
          </p>
        </div>

        <div className="form-card">
          <p className="movie-card-year">Signed in as</p>
          <h2 className="status-title">{user.name}</h2>
          <p className="status-message">{user.email}</p>

          <div className="inline-actions">
            <Link className="load-more-btn status-link" to="/watchlist">
              Open watchlist
            </Link>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                signOut();
                navigate("/auth", { replace: true });
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="section-copy">
        <h1 className="home-title">Account</h1>
        <p className="home-subtitle">
          This phase uses {config.authProviderLabel} so you can sign in, save a watchlist, and leave reviews.
        </p>
      </div>

      {prompt?.message ? (
        <ErrorState
          title="Sign-in required"
          message={prompt.message}
          action={
            <Link className="load-more-btn status-link" to="/">
              Keep browsing
            </Link>
          }
        />
      ) : null}

      <div className="form-card">
        <div className="auth-toggle-row" role="tablist" aria-label="Account mode">
          <button
            type="button"
            className={mode === "sign-in" ? "auth-toggle auth-toggle-active" : "auth-toggle"}
            onClick={() => {
              setMode("sign-in");
              setErrorMessage(null);
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "sign-up" ? "auth-toggle auth-toggle-active" : "auth-toggle"}
            onClick={() => {
              setMode("sign-up");
              setErrorMessage(null);
            }}
          >
            Create account
          </button>
        </div>

        <form className="stacked-form" onSubmit={handleSubmit}>
          {mode === "sign-up" ? (
            <>
              <label className="field-label" htmlFor="account-name">
                Name
              </label>
              <input
                id="account-name"
                className="text-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </>
          ) : null}

          <label className="field-label" htmlFor="account-email">
            Email
          </label>
          <input
            id="account-email"
            className="text-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label className="field-label" htmlFor="account-password">
            Password
          </label>
          <input
            id="account-password"
            className="text-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            required
          />

          {errorMessage ? <p className="helper-message error-copy">{errorMessage}</p> : null}

          <div className="inline-actions">
            <button type="submit" className="load-more-btn" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "sign-up"
                  ? "Creating account..."
                  : "Signing in..."
                : mode === "sign-up"
                  ? "Create account"
                  : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
