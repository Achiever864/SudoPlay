import React, { useState, useEffect } from "react";

// ------------------------------------------------------------------
// Username Modal — collects a display name before the leaderboard
// can record a run. Import and render at the top of any page that
// needs to capture a player's leaderboard identity.
//
// Usage:
//   <UsernameModal
//       isOpen={isUsernameModalOpen}
//       onSubmit={(name) => { ...save it... }}
//       initialValue={username ?? ""}
//   />
// ------------------------------------------------------------------

interface UsernameModalProps {
    isOpen: boolean;
    onSubmit: (name: string) => void;
    initialValue?: string;
}

export default function UsernameModal({
    isOpen,
    onSubmit,
    initialValue = "",
}: UsernameModalProps) {
    const [value, setValue] = useState(initialValue);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
            setTouched(false);
        }
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    const trimmed = value.trim();
    const tooShort = trimmed.length > 0 && trimmed.length < 2;
    const tooLong = trimmed.length > 16;
    const isValid = trimmed.length >= 2 && trimmed.length <= 16;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched(true);
        if (!isValid) return;
        onSubmit(trimmed);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="username-modal-title"
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl p-6 sm:p-7 relative animate-[fadeIn_150ms_ease-out]"
            >
                {/* Accent glow */}
                <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

                <h2
                    id="username-modal-title"
                    className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase"
                >
                    Enter the board
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Pick a name for the leaderboard. You can change it later.
                </p>

                <div className="mt-5">
                    <label htmlFor="username-input" className="sr-only">
                        Username
                    </label>
                    <input
                        id="username-input"
                        type="text"
                        autoFocus
                        value={value}
                        maxLength={16}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={() => setTouched(true)}
                        placeholder="e.g. GridWizard"
                        className={`w-full bg-slate-900/70 text-slate-100 placeholder-slate-500 font-medium text-lg tracking-wide rounded-xl px-4 py-3 border transition
                            focus:outline-none focus:ring-2 focus:ring-cyan-500/60
                            ${touched && !isValid ? "border-rose-500/70" : "border-slate-700/60"}`}
                    />

                    <div className="flex justify-between items-center mt-2 min-h-[1.25rem]">
                        <span className="text-xs text-rose-400 font-medium">
                            {touched && tooShort && "At least 2 characters"}
                            {touched && tooLong && "16 characters max"}
                        </span>
                        <span className="text-xs text-slate-500 font-mono ml-auto">
                            {trimmed.length}/16
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!isValid}
                    className="mt-4 w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition
                        bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950
                        hover:from-cyan-400 hover:to-blue-400
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-cyan-500 disabled:hover:to-blue-500
                        active:scale-[0.98]"
                >
                    Start playing
                </button>
            </form>
        </div>
    );
}