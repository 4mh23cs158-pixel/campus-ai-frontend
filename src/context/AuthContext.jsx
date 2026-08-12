import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  // ==========================================
  // CURRENT USER
  // ==========================================

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error(
        "Error reading currentUser:",
        error
      );

      return null;
    }
  });


  // ==========================================
  // ROLE
  // ==========================================

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });


  // ==========================================
  // AUTHENTICATION STATUS
  // ==========================================

  const isAuthenticated = !!currentUser;


  // ==========================================
  // KEEP LOCAL STORAGE IN SYNC
  // ==========================================

  useEffect(() => {

    if (currentUser) {

      localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
      );

      const normalizedRole =
        currentUser.role
          ?.toString()
          .trim()
          .toLowerCase();

      localStorage.setItem(
        "role",
        normalizedRole || ""
      );

      setRole(normalizedRole || null);

    } else {

      localStorage.removeItem(
        "currentUser"
      );

      localStorage.removeItem(
        "role"
      );

      setRole(null);
    }

  }, [currentUser]);


  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      console.log("LOGIN API RESPONSE:", response.data);

      // Support different backend response structures
      const userData = response.data?.user || response.data;

      if (!userData) {
        return {
          success: false,
          message: "Login succeeded, but user information was not returned by the server.",
        };
      }

      // Extract role from various possible backend fields
      const rawRole = response.data?.role || userData?.role || userData?.user_type;
      
      let normalizedRole = rawRole?.toString().trim().toLowerCase() || "student";

      if (
        normalizedRole !== "student" &&
        normalizedRole !== "staff" &&
        normalizedRole !== "admin"
      ) {
        return {
          success: false,
          message: "Invalid user role received from the server.",
        };
      }

      const finalUser = {
        ...userData,
        role: normalizedRole,
      };

      setCurrentUser(finalUser);
      setRole(normalizedRole);

      localStorage.setItem("currentUser", JSON.stringify(finalUser));
      localStorage.setItem("role", normalizedRole);

      return {
        success: true,
        user: finalUser,
        role: normalizedRole,
      };

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return {
        success: false,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  };


  // ==========================================
  // SIGNUP
  // ==========================================

  const signup = async (userData) => {

    try {

      const response = await api.post(
        "/signup",
        userData
      );

      console.log(
        "SIGNUP RESPONSE:",
        response.data
      );

      return {
        success: true,
        data: response.data,
      };

    } catch (error) {

      console.error(
        "SIGNUP ERROR:",
        error
      );

      return {
        success: false,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Signup failed.",
      };
    }
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {

    try {

      await api.get("/logout");

    } catch (error) {

      console.error(
        "Logout API error:",
        error
      );

    } finally {

      // Clear React state
      setCurrentUser(null);
      setRole(null);

      // Clear local storage
      localStorage.removeItem(
        "currentUser"
      );

      localStorage.removeItem(
        "role"
      );
    }
  };


  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    currentUser,
    role,
    isAuthenticated,

    login,
    signup,
    logout,
  };


  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};