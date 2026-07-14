import React, { createContext, useContext, useState } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert";
const DIFFICULTY_STORAGE_KEY = "sudoku_difficulty";

interface SettingsContextValue {
    difficulty: Difficulty;
    setDifficulty: (d: Difficulty) => void;
    isSettingsOpen: boolean;
    openSettings: () => void;
    closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode}){
    const [difficulty, setDifficultyState] = useState<Difficulty>(() => {
        try {
            return (window.localStorage.getItem(DIFFICULTY_STORAGE_KEY) as Difficulty) ?? "medium";
        } catch {
            return "medium";
        }
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const setDifficulty = (d: Difficulty) => {
        setDifficultyState(d);
        try{
            window.localStorage.setItem(DIFFICULTY_STORAGE_KEY, d);
        }catch {
            // duhh again...
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                difficulty,
                setDifficulty,
                isSettingsOpen,
                openSettings: () => setIsSettingsOpen(true),
                closeSettings: () => setIsSettingsOpen(false),
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings(){
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error("useSettings must be used within a settings provider");
    return ctx;
}