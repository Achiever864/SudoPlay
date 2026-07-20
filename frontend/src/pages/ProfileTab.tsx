import { useAuth } from "../context/AuthContext";

function StatTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/30 px-4 py-3 text-center">
            <div className="text-xl font-black text-cyan-400 font-mono">{value}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{label}</div>
        </div>
    );
}

interface Achievement {
    id: string;
    label: string;
    unlocked: boolean;
}


const ACHIEVEMENTS: Achievement[] = [
    { id: "first-win", label: "First solve", unlocked: true },
    { id: "no-errors", label: "Flawless run", unlocked: true },
    { id: "speed-5", label: "Under 5 min", unlocked: false },
    { id: "streak-7", label: "7 day streak", unlocked: false },
    { id: "expert-solve", label: "Expert solved", unlocked: false },
    { id: "hundred", label: "100 solved", unlocked: false },
];

export default function ProfileTab() {
    const { user } = useAuth();
    const username = user?.username ?? "Unknown";

    return (
        <div className="w-full max-w-lg flex flex-col gap-6">
            {/* Identity card */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl font-black text-slate-950 shrink-0">
                    {username ? username.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                    <div className="text-lg font-bold text-slate-100">{username}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
                        Rank #12 global
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <StatTile label="Solved" value="18" />
                <StatTile label="Best time" value="04:52" />
                <StatTile label="Streak" value="3" />
            </div>

            {/* Achievements */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                    Achievements
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {ACHIEVEMENTS.map((a) => (
                        <div
                            key={a.id}
                            className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border text-center transition
                                ${
                                    a.unlocked
                                        ? "border-cyan-500/40 bg-cyan-500/10"
                                        : "border-slate-700/40 bg-slate-800/30 opacity-40"
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full ${
                                    a.unlocked ? "bg-gradient-to-br from-cyan-400 to-blue-500" : "bg-slate-700"
                                }`}
                            />
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-300 px-1">
                                {a.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}