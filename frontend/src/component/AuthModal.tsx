import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal() {
    const {
        isAuthModalOpen,
        authModalMode,
        authError,
        isAuthLoading,
        closeAuthModal,
        openAuthModal,
        login,
        register,
        isAuthenticated
    } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (!isAuthModalOpen) return null;

    const isRegister = authModalMode === "register";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isRegister) {
            await register(username.trim(), password);
        } else {
            await login(username.trim(), password);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
        >
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl p-6 sm:p-7 relative animate-in fade-in zoom-in duration-200"
            >
                <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

                {isAuthenticated && (
                    <button
                        type="button"
                        onClick={closeAuthModal}
                        aria-label="Dismiss"
                        className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <h2
                    id="auth-modal-title"
                    className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase"
                >
                    {isRegister ? "Create account" : "Welcome back"}
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {isRegister
                        ? "Save your progress and climb the leaderboard from any device."
                        : "Sign in to sync your stats and rank."}
                </p>

                <div className="mt-5 flex flex-col gap-3">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="w-full bg-slate-900/70 text-slate-100 placeholder-slate-500 font-medium rounded-xl px-4 py-3 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        minLength={6}
                        className="w-full bg-slate-900/70 text-slate-100 placeholder-slate-500 font-medium rounded-xl px-4 py-3 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                    />
                </div>

                {authError && (
                    <p className="text-xs text-rose-400 mt-3 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
                        {authError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="mt-5 w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition
                        bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950
                        hover:from-cyan-400 hover:to-blue-400
                        disabled:opacity-50 disabled:cursor-not-allowed
                        active:scale-[0.98]"
                >
                    {isAuthLoading ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
                </button>

                <p className="text-xs text-slate-500 text-center mt-4">
                    {isRegister ? "Already have an account?" : "New here?"}{" "}
                    <button
                        type="button"
                        onClick={() => openAuthModal(isRegister ? "login" : "register")}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                        {isRegister ? "Sign in" : "Create one"}
                    </button>
                </p>
            </form>
        </div>
    );
}