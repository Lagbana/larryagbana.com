import { createContext, useContext } from "react";
import { AuthService } from "../services/AuthService";

export const AuthServiceContext = createContext<AuthService | undefined>(
  undefined
);

export const useAuthService = () => {
  const context = useContext(AuthServiceContext);
  if (!context) {
    throw new Error("userAuthService must be within a AuthServiceProvider");
  }
  return context;
};
