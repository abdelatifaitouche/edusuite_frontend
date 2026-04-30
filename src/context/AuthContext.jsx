import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, getMe , logout as logoutService } from "@/services/auth.service";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // check session on mount
  useEffect(() => {
    getMe()
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    await loginService(email, password);
    const data = await getMe();
    setUser(data);
  };

  const logout = async () => {
    await logoutService()
    setUser(null)

  }

  return (
    <AuthContext.Provider value={{ user, loading, login , logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook — cleaner usage
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}