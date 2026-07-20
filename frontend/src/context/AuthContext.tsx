import React, { createContext, useContext, useEffect, useState } from "react";

const TOKEN_STORAGE_KEY = "sudoku_auth_token";
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface AuthUser {
    id: string;
    username: string;
    avatar?: string;
}

type AuthModalMode = "login" | "register";

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;
    authModalMode: AuthModalMode;
    authError: string | null;
    isAuthLoading: boolean;
    openAuthModal: (mode: AuthModalMode) => void;
    closeAuthModal: () => void;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");
    const [authError, setAuthError] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
            if (token) {
                try {
                    const res = await fetch(`${API_BASE}/api/user/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!res.ok) throw new Error("Session expired");
                    const data = await res.json();
                    setUser(data.user);
                } catch {
                    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
                }
            }
            setIsInitialLoading(false);
        };

        initializeAuth();
    }, []);

    // Force login modal if no user is found after initial load
    useEffect(() => {
        if (!isInitialLoading && !user) {
            setIsAuthModalOpen(true);
        }
    }, [isInitialLoading, user]);

    const openAuthModal = (mode: AuthModalMode) => {
        setAuthError(null);
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    };
    
    // Only allow closing the modal if the user is authenticated
    const closeAuthModal = () => {
        if (user) setIsAuthModalOpen(false);
    };

    const handleAuthSuccess = (token: string, authedUser: AuthUser) => {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
        setUser(authedUser);
        setIsAuthModalOpen(false);
    };

    const login = async (username: string, password: string) => {
        setIsAuthLoading(true);
        setAuthError(null);
        try {
            const res = await fetch(`${API_BASE}/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Login failed");
            handleAuthSuccess(data.token, data.user);
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setIsAuthLoading(false);
        }
    };

    const register = async (username: string, password: string) => {
        setIsAuthLoading(true);
        setAuthError(null);
        try {
            const res = await fetch(`${API_BASE}/api/user/register`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Registration failed");
            handleAuthSuccess(data.token, data.user);
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsAuthLoading(false);
        }
    };

    const logout = () => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAuthModalOpen,
                authModalMode,
                authError,
                isAuthLoading,
                openAuthModal,
                closeAuthModal,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}