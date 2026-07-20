import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * A small, dismissible nudge to sign up — not a wall. Renders nothing once
 * the user is authenticated or has dismissed it for this session.
 */
export default function GuestNudge({ message }: { message: string }) {
    const { isAuthenticated, openAuthModal } = useAuth();
    const [dismissed, setDismissed] = useState(false);

    if (isAuthenticated || dismissed) return null;

    return (
        <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400 leading-snug">{message}</p>
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={() => openAuthModal("register")}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 whitespace-nowrap"
                >
                    Sign up
                </button>
                <button
                    onClick={() => setDismissed(true)}
                    aria-label="Dismiss"
                    className="text-slate-500 hover:text-slate-300 transition"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}