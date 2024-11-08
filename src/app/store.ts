import { create } from "zustand";
import { UserProps } from "./types/UserType";
import Cookies from "js-cookie";
interface authStoreProps {
  user: UserProps | null;
  setUser: (user: UserProps | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
export const useAuthStore = create<authStoreProps>((set) => ({
  user: null,
  setUser: (user: UserProps | null) => set({ user, isAuthenticated: !!user }),
  isAuthenticated: false,
  logout: () => {
    Cookies.remove("token");
    localStorage.removeItem("tokenExpiresAt");
    set({ user: null });
  },
}));
