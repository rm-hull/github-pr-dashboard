import { createContext, useContext, useState, PropsWithChildren } from "react";

interface AuthStatusContextType {
  isAuthExpired: boolean;
  setAuthExpired: (expired: boolean) => void;
}

const AuthStatusContext = createContext<AuthStatusContextType | undefined>(undefined);

export const AuthStatusProvider = ({ children }: PropsWithChildren) => {
  const [isAuthExpired, setAuthExpired] = useState(false);

  return <AuthStatusContext.Provider value={{ isAuthExpired, setAuthExpired }}>{children}</AuthStatusContext.Provider>;
};

export const useAuthStatus = () => {
  const context = useContext(AuthStatusContext);
  if (context === undefined) {
    throw new Error("useAuthStatus must be used within an AuthStatusProvider");
  }
  return context;
};
