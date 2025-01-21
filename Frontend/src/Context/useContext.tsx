import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  userData: any;
  userRole: any;
  isVerified: boolean;
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const storedData = JSON.parse(sessionStorage.getItem("user_data") || "null");
    if (storedData) {
      const { userToken, user } = storedData;
      setToken(userToken);
      setUserData(user);
      setIsAuthenticated(true);
      setUserRole(user.role);
      setIsVerified(user.verified);
    }

  }, []);


  const login = (newToken: string, newData: any) => {
    sessionStorage.setItem(
      "user_data",
      JSON.stringify({ userToken: newToken, user: newData })
    );
    setToken(newToken);
    setUserData(newData);
    setIsAuthenticated(true);
    setUserRole(newData.role);
    setIsVerified(newData.verified);
  };

  const logout = () => {
    sessionStorage.removeItem("user_data");
    localStorage.removeItem('lastRoute');
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
    setUserRole(null);
    setIsVerified(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        userData,
        userRole,
        isVerified,
        login,
        logout,
      }}
    >
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
