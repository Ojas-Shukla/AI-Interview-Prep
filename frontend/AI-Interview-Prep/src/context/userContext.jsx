import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ai-interview-user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("ai-interview-token") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("ai-interview-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ai-interview-user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("ai-interview-token", token);
    } else {
      localStorage.removeItem("ai-interview-token");
    }
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken("");
  };

  const value = useMemo(
    () => ({ user, token, setUser, setToken, logout, loading, setLoading }),
    [user, token, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};
