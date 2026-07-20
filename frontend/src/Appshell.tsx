import React, { useState } from "react";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import TopBar, { type Tab } from "./component/Topbar";
import BottomTabBar from "./component/BottomTabBar";
import SettingsDrawer from "./component/SettingsDrawer";
import AuthModal from "./component/AuthModal";
import PlayTab from "./pages/PlayTab";
import LeaderboardTab from "./pages/LeaderboardTab";
import ProfileTab from "./pages/ProfileTab";

function ShellContent() {
    const [activeTab, setActiveTab] = useState<Tab>("play");

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 pb-24 sm:pb-4 antialiased">
            <SettingsDrawer />
            <AuthModal />

            <TopBar activeTab={activeTab} />

            <div className="w-full flex flex-col items-center flex-1">
                <div className={activeTab === "play" ? "contents" : "hidden"}>
                    <PlayTab />
                </div>
                {activeTab === "leaderboard" && <LeaderboardTab />}
                {activeTab === "profile" && <ProfileTab />}
            </div>

            <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
        </div>
    );
}

export default function AppShell() {
    return (
        <React.StrictMode>
        <ThemeProvider>
            <SettingsProvider>
                <AuthProvider>
                    <ShellContent />
                </AuthProvider>
            </SettingsProvider>
        </ThemeProvider>
        </React.StrictMode>
    );
}