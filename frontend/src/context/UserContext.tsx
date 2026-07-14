import React, { createContext, useContext, useEffect, useState } from "react";

const USERNAME_STORAGE_KEY = "sudoku_username";

interface UserContextValue {
    username: string | null;
    isUsernameModalOpen: boolean;
    openUsernameModal: () => void;
    submitUsername: (name: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [username, setUsername] = useState<string | null>(null);
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(USERNAME_STORAGE_KEY);
            if (stored) {
                setUsername(stored);
            } else {
                setIsUsernameModalOpen(true);
            }
        } catch {
            setIsUsernameModalOpen(true);
        }
    }, []);

    const submitUsername = (name: string) => {
        setUsername(name);
        setIsUsernameModalOpen(false);
        try {
            window.localStorage.setItem(USERNAME_STORAGE_KEY, name); //well we actually want to create guest user at the backend like shey you get?
            
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