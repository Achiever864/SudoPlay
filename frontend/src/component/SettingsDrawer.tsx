import React from "react";
import { useSettings, type Difficulty } from "../context/SettingsContext";
import { useTheme, type Theme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "expert"];

const THEMES: { id: Theme; label: string; swatch: string }[] = [
    { id: "cyan", label: "Cyan", swatch: "from-cyan-400 to-blue-500" },
    { id: "violet", label: "Violet", swatch: "from-purple-400 to-fuchsia-500" },
    { id: "emerald", label: "Emerald", swatch: "from-emerald-400 to-teal-500" },
];

export default function SettingsDrawer() {
    const { difficulty, setDifficulty, isSettingsOpen, closeSettings } = useSettings();
    const { theme, setTheme } = useTheme();
    const { openUsernameModal } = useUser();

    if (!isSettingsOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={closeSettings}
        >
            <div
                className="w-full max-w-sm h-full bg-slate-800 border-l border-slate-700/60 shadow-2xl p-6 sm:p-7 overflow-y-auto animate-in slide-in-from-right duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2
                        id="settings-title"
                        className="text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase"
                    >
                        Settings
                    </h2>
                    <button
                        onClick={closeSettings}
                        aria-label="Close settings"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Difficulty */}
                <section className="mb-7">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                        Difficulty
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {DIFFICULTIES.map((d) => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`py-2.5 rounded-xl text-sm font-semibold uppercase tracking-wide border transition
                                    ${
                                        difficulty === d
                                            ? "bg-cyan-600/20 border-cyan-500 text-cyan-400"
                                            : "bg-slate-900/60 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Applies to your next puzzle.</p>
                </section>

                {/* Theme */}
                <section className="mb-7">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Theme</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition
                                    ${
                                        theme === t.id
                                            ? "border-cyan-500 bg-slate-900/60"
                                            : "border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60"
                                    }`}
                            >
                                <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${t.swatch}`} />
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                                    {t.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Account */}
                <section>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Account</h3>
                    <button
                        onClick={() => {
                            closeSettings();
                            openUsernameModal();
                        }}
                        className="w-full py-3 rounded-xl bg-slate-900/60 border border-slate-700/50 text-sm font-semibold text-slate-300 hover:bg-slate-700/50 transition"
                    >
                        Change username
                    </button>
                </section>
            </div>
        </div>
    );
}