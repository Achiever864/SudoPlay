import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "cyan" | "violet" | "emerald";
const THEME_STORAGE_KEY = "sudoku_theme";

interface ThemeContextValue{
    theme: Theme;
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: {children: React.ReactNode }){
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
            return (stored as Theme) ?? "cyan";
        } catch (error) {
            return "cyan";
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
            
        }
    }, [theme]);

    const setTheme = (t: Theme) => setThemeState(t);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}