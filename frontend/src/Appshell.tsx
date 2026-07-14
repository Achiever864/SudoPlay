import React, { useState } from "react";
import { UserProvider, useUser } from "./context/UserContext.tsx";
import { SettingsProvider } from "./context/SettingsContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import TopBar, { type Tab } from "./component/Topbar.tsx";
import BottomTabBar from "./component/BottomTabBar.tsx";
import SettingsDrawer from "./component/SettingsDrawer.tsx";
import UsernameModal from "./component/UsernameModal.tsx";
import PlayTab from "./pages/PlayTab.tsx";
import LeaderboardTab from "./pages/LeaderboardTab.js";
import ProfileTab from "./pages/ProfileTab.tsx";

function ShellContent() {
    const [activeTab, setActiveTab] = useState<Tab>("play");
    const { isUsernameModalOpen, submitUsername, username } = useUser();

    return(
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 pb-24 sm:pb-4 antialiased">
            <UsernameModal isOpen={isUsernameModalOpen} onSubmit={submitUsername} initialValue={username ?? ""} />
            <SettingsDrawer />

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

export default function AppShell(){
    return(
        <ThemeProvider>
            <SettingsProvider>
                <UserProvider>
                    <ShellContent />
                </UserProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
};