import { createContext, useState } from "react";

const AuthContext = createContext({
  user: {},
  token: null,
  handleLogin: () => {},
  handleLogout: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const handleLogin = (accessToken, user) => {
    setAccessToken(accessToken);
    setUser(user);
  };

  const handleLogout = async () => {
    setAccessToken(null);
    setUser(null);
    // fetch logout endpoint
    try {
      const URL = "http://localhost:5000/logout";
      await fetch(URL, { method: "POST" });
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const refreshToken = async () => {
    try {
      const url = "http://localhost/auth/refresh";
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) {
        throw new Error("Refresh token failed");
      }
      const data = await res.json();
      const newAccessToken = data.data.accessToken;
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Refresh token failed: ", error);
      handleLogout();
      return null;
    }
  };

  const fetchWithAuth = async (URL, options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    let res = await fetch(URL, { ...options, headers });
    if ((res.status === 401 || res.status === 403) && accessToken) {
      console.log("Token expired. Attempt to refresh token");
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        console.log("Token refreshed. Fetch again");
        const newHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        res = await fetch(URL, { ...options, newHeaders });
      }
    }
    return res;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // fetch dashboard
        const URL = "http://localhost:5000/auth/refresh";
        const res = await fetch(URL, { method: "POST" });
        if (res.ok) {
          const data = res.json();
          setAccessToken(data.data.accessToken);
          setUser(data.data.user);
        } else {
          throw new Error("Unauthenticated");
        }
      } catch (error) {
        console.error("Authentication check failed: ", error);
        setAccessToken(null);
        setUser(null);
      }
      checkAuth();
    };
  }, []);

  const value = { user, accessToken, handleLogin, handleLogout, fetchWithAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
