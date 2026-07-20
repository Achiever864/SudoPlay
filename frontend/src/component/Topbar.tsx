import React from "react";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";

export type Tab = "play" | "leaderboard" | "profile";

const TAB_LABELS: Record<Tab, string> = {
    play: "Sudoku",
    leaderboard: "Leaderboard",
    profile: "Profile",
};

export default function TopBar({ activeTab }: { activeTab: Tab }) {
    const { openSettings } = useSettings();
    const { user } = useAuth();

    return (
        <header className="w-full max-w-lg flex items-center justify-between px-1 mb-6">
            <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
                {TAB_LABELS[activeTab]}
            </h1>

            <div className="flex items-center gap-3">
                {user && (
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 group cursor-default">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        {user.username}
                    </div>
                )}

                <button
                    onClick={openSettings}
                    aria-label="Open settings"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-cyan-400 transition"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </button>
            </div>
        </header>
    );
}