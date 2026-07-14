import React from "react";
import type { Tab } from "./TopBar";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
        id: "play",
        label: "Play",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
            </svg>
        ),
    },
    {
        id: "leaderboard",
        label: "Ranks",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
                <path d="M17 6h3a1 1 0 0 1 1 1 4 4 0 0 1-4 4M7 6H4a1 1 0 0 0-1 1 4 4 0 0 0 4 4" />
            </svg>
        ),
    },
    {
        id: "profile",
        label: "Profile",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
        ),
    },
];

export default function BottomTabBar({
    activeTab,
    onChange,
}: {
    activeTab: Tab;
    onChange: (tab: Tab) => void;
}) {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2
                sm:static sm:mt-6 sm:bg-slate-800/50 sm:rounded-xl sm:border sm:border-slate-700/50 sm:shadow-xl"
        >
            <div className="max-w-lg mx-auto grid grid-cols-3 gap-1">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition text-xs font-semibold uppercase tracking-wide
                                ${isActive ? "text-cyan-400 bg-cyan-500/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}