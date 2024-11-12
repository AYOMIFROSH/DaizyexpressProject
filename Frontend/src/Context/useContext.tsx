import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  userData: any;
  userRole: any;
  login: (newToken: string, newData: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const storedData = JSON.parse(localStorage.getItem("user_data") || "null");
  const [userRole, setUserRole] = useState(null);


  useEffect(() => {
    if (storedData) {
      const { userToken, user } = storedData;
      setToken(userToken);
      setUserData(user);
      setIsAuthenticated(true);
      setUserRole(user.role);

    }
  }, []);

  const login = (newToken: string, newData: any) => {
    localStorage.setItem(
      "user_data",
      JSON.stringify({ userToken: newToken, user: newData })
    );
    setToken(newToken);
    setUserData(newData);
    setIsAuthenticated(true);
    setUserRole(newData.role);

  };

  const logout = () => {
    localStorage.removeItem("user_data");
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
    setUserRole(null);

  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, userData, login, logout, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
