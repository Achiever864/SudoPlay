import React, { createContext, useContext, useEffect, useState } from "react";

const TOKEN_STORAGE_KEY = "sudoku_auth_token";
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface AuthUser {
    id: string;
    username: string;
    email: string;
    isGuest: boolean;
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
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");
    const [authError, setAuthError] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);

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
                    return;
                } catch {
                    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
                }
            }
            
            // If no token or token expired, silently create guest user
            try {
                const res = await fetch(`${API_BASE}/api/user/guest/create`, {
                    method: "POST",
                });
                const data = await res.json();
                window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
                setUser(data.user);
            } catch (err) {
                console.error("Failed to create guest session", err);
            }
        };

        initializeAuth();
    }, []);

    const openAuthModal = (mode: AuthModalMode) => {
        setAuthError(null);
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    };
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const handleAuthSuccess = (token: string, authedUser: AuthUser) => {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
        setUser(authedUser);
        setIsAuthModalOpen(false);
    };

    const login = async (email: string, password: string) => {
        setIsAuthLoading(true);
        setAuthError(null);
        try {
            const res = await fetch(`${API_BASE}/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
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

    const register = async (username: string, email: string, password: string) => {
        setIsAuthLoading(true);
        setAuthError(null);
        try {
            const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
            const res = await fetch(`${API_BASE}/api/user/register`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ username, email, password }),
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
        fetch(`${API_BASE}/api/user/guest/create`, { method: "POST" })
            .then(res => res.json())
            .then(data => {
                window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
                setUser(data.user);
            })
            .catch(err => console.error("Failed to create guest session after logout", err));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user ? !user.isGuest : false,
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