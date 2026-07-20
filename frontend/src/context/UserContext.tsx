import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import API from "../api/axios";

interface UserContextValue {
    username: string | null;
    isUsernameModalOpen: boolean;
    openUsernameModal: () => void;
    submitUsername: (name: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

    // Now username comes straight from the backend via AuthContext
    const username = user?.username ?? null;

    const submitUsername = async (name: string) => {
        //duhh
        setIsUsernameModalOpen(false);
        try {
            //omor...still working here
        } catch {
            //duhhh....
        }
    };

    const openUsernameModal = () => setIsUsernameModalOpen(true);

    return (
        <UserContext.Provider
            value={{ username, isUsernameModalOpen, openUsernameModal, submitUsername }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
}