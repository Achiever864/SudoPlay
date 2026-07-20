import React, { useState } from "react";
import { UserProvider, useUser } from "./context/UserContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import TopBar, { type Tab } from "./component/Topbar";
import BottomTabBar from "./component/BottomTabBar";
import SettingsDrawer from "./component/SettingsDrawer";
import UsernameModal from "./component/UsernameModal";
import AuthModal from "./component/AuthModal";
import PlayTab from "./pages/PlayTab";
import LeaderboardTab from "./pages/LeaderboardTab";
import ProfileTab from "./pages/ProfileTab";

function ShellContent() {
    const [activeTab, setActiveTab] = useState<Tab>("play");
    const { isUsernameModalOpen, submitUsername, username } = useUser();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 pb-24 sm:pb-4 antialiased">
            <UsernameModal isOpen={isUsernameModalOpen} onSubmit={submitUsername} initialValue={username ?? ""} />
            <SettingsDrawer />
            <AuthModal />

            <TopBar activeTab={activeTab} />

            {/* Play stays mounted (just hidden) when you switch tabs, so the
                board and timer survive a glance at the leaderboard instead
                of resetting. Leaderboard/Profile are cheap to remount. */}
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
        <ThemeProvider>
            <SettingsProvider>
                <AuthProvider>
                    <UserProvider>
                        <ShellContent />
                    </UserProvider>
                </AuthProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
}