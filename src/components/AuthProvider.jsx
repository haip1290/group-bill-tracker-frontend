import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
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

  /**
   * @description this function call /logout endpoint
   * then clear access token and user info in context
   */

  const handleLogout = async () => {
    // fetch logout endpoint
    try {
      // call /logout endpint
      const URL = "http://localhost:5000/logout";
      const res = await fetch(URL, { method: "POST" });
      // only clear token and user if response ok
      if (res.ok) {
        setAccessToken(null);
        setUser(null);
        console.log("Logout successful");
      } else {
        // notice user logout fail
        const error = res.json();
        console.error("Failed to logout ", error);
        alert("Logout failed. Please try again"); // need to implement modal here
      }
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };
  /**
   * @description this function get new access token from backend then set it into context
   * if it fails to get new token, it call @see handleLogout
   *
   * @returns the new access token
   */
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

  /**
   * @description this function input access token into headers before calling fetch from backend
   * in case it fails to fetch, it will try to @see refreshToken and fetch again with new access token
   * then return the response
   *
   * @param {string} URL
   * @param {object} options
   * @returns {Promise <object || null>}
   */

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

  /**
   * @description this hook fetch /refresh endpoint from backend
   * to check if user is already authenticated or not
   * in case user is authenticated, it will set new access token and user info into context
   */

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
