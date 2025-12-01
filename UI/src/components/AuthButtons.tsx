import { useEffect, useState } from "react";

export default function AuthButtons() {
  const [status, setStatus] = useState("Checking authentication...");
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  async function getMe() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();

      if (data.authenticated) {
        setAuthenticated(true);
        setUser(data.user);
        setStatus(`Logged in as: ${data.user.email || data.user.username}`);
      } else {
        setAuthenticated(false);
        setUser(null);
        setStatus("Not logged in");
      }
    } catch (err) {
      setStatus("Error checking authentication");
    }
  }

  useEffect(() => {
    getMe();
  }, []);

  const login = () => {
    window.location.href = "/api/auth/oauth/login";
  };

  const logout = async () => {
    await fetch("/api/auth/oauth/logout", {
      method: "GET",
      credentials: "include",
    });
    getMe();
  };

  return (
    <div>
      <p>{status}</p>

      {!authenticated && (
        <button onClick={login} style={{ marginRight: "10px" }}>
          Login
        </button>
      )}

      {authenticated && (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
}
