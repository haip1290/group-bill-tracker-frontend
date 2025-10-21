import {
  createContext,
  useState,
  useEffect,
  use,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  user: {},
  token: null,
  handleLogin: () => {},
  handleLogout: () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error("Failed to get authorization context");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthFetching, setIsAuthFetching] = useState(true);
  const navigate = useNavigate();

  const handleLogin = useCallback(
    (accessToken, user) => {
      setAccessToken(accessToken);
      setUser(user);
      navigate("/dashboard");
    },
    [navigate]
  );

  /**
   * @description this function call /logout endpoint
   * then clear access token and user info in context
   */

  const handleLogout = useCallback(async () => {
    // fetch logout endpoint
    try {
      // call /logout endpint
      console.log("Login...");
      const URL = "http://localhost:5000/logout";
      const res = await fetch(URL, { method: "POST" });
      // handle non ok response
      if (!res.ok) {
        const data = await res.json();
        const errMsg = data.message || "Logout failed";
        throw new Error(errMsg);
      }
      // only clear token and user if response ok

      setAccessToken(null);
      setUser(null);
      navigate("/login");
      console.log("Logout successful");
    } catch (e) {
      console.error("Logout failed:", e);
      navigate("/error", {
        state: { message: e.message || "Log out failed due to server error" },
      });
    }
  }, [navigate]);
  /**
   * @description this function get new access token from backend then set it into context
   * if it fails to get new token, it call @see handleLogout
   *
   * @returns the new access token
   */
  const refreshToken = useCallback(async () => {
    try {
      const URL = "http://localhost:5000/auth/refresh";
      const options = { method: "POST", credentials: "include" };
      const res = await fetch(URL, options);
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
  }, [handleLogout]);

  /**
   * @description this function input access token into headers before calling fetch from backend
   * in case it fails to fetch, it will try to @see refreshToken and fetch again with new access token
   * then return the response
   *
   * @param {string} URL
   * @param {object} options
   * @param {AbortSignal} signal - signal to cancel the request
   * @returns {Promise <object || null>}
   */

  const fetchWithAuth = useCallback(
    async (URL, options = {}, signal) => {
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      const addedOptions = { credentials: "include" };
      let res = await fetch(URL, {
        ...options,
        ...addedOptions,
        headers,
        signal,
      });
      // check response status and attempt to get new token if token expired
      if (res.status === 401 || res.status === 403) {
        console.log("Token expired. Attempt to refresh token");
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          console.log("Token refreshed. Fetch again");
          const newHeaders = {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          res = await fetch(URL, {
            ...options,
            ...addedOptions,
            headers: newHeaders,
            signal,
          });
        } else {
          throw new Error("Authentication failed after token refresh attempt");
        }
      }
      return res;
    },
    [accessToken, refreshToken]
  );

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
        const options = {
          method: "POST",
          credentials: "include",
        };
        const res = await fetch(URL, options);
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.data.accessToken);
          setUser(data.data.user);
        } else {
          throw new Error("Unauthenticated");
        }
      } catch (error) {
        console.error("Authentication check failed: ", error);
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsAuthFetching(false);
      }
    };
    checkAuth();
  }, []);

  const authValue = {
    user,
    accessToken,
    handleLogin,
    handleLogout,
    fetchWithAuth,
    isAuthFetching,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
