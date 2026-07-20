import React, { useState } from "react";

interface LeaderboardEntry {
    rank: number;
    username: string;
    time: string;
    xp: number;
    solvedCount: number;
    region?: string;
}

export default function LeaderboardPage(){
    const [scope, setScope] = useState<"global" | "regional">("global");

    //Static Mock Data for Global Ranks
    const globalData: LeaderboardEntry[] = [
        {rank: 1, username: "SudokuPage", time: "02:14", xp: 4850, solvedCount: 142},
        {rank: 2, username: "MatrixSolver", time: "02:35", xp: 4610, solvedCount: 128},
        {rank: 3, username: "BitShift", time:"02:41", xp:4300, solvedCount: 119},
        {rank: 4, username: "CyberCell", time: "03:02", xp: 3950, solvedCount: 150},
    ];

    //static data for regional ranks (Nigeria)
    const regionalData: LeaderboardEntry[] = [
        {rank: 1, username: "IbDev01", time: "02:22", xp: 4700, solvedCount: 135, region:"NG" },
        {rank: 2, username: "Lagos_Grid", time: "02:48", xp: 3900, solvedCount: 110, region: "NG"},
        {rank: 3, username: "Tech_Whiz", time: "03:10", xp: 3700, solvedCount: 75, region: "GH"},
    ];

    const currentData = scope === "global" ? globalData : regionalData;

    //separate podium (Top 3) from Remaining list rows
    const podiumPlayers = currentData.slice(0,3);
    const listPlayers = currentData.slice(3);

    //Helper styling function for podium heights and color rings
    const getPodiumOrderStyles = (rank: number) => {
        if (rank === 1) return {order: "order-2", height: "h-36 sm:h-40", border: "border-amber-400 bg-amber-500/10", text: "text-amber-400", label: "1st"};
        if (rank === 2) return {order: "order-1", height: "h-28 sm:h-32", border: "border-slate-300 bg-slate-300/10", text: "text-slate-300", label: "2nd"};
        return {order: "order-3", height: "h-24 sm:h-28", border: "border-amber-700 bg-amber-700/10", text: "text-amber-700", label: "3rd" };
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-8 antialiased">
            {/*Header */}
            <header className="mb-6 text-center max-w-lg w-full">
                <h1 className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 uppercase">
                    Leaderboard
                </h1>
                <p className="text-xs text-slate-400 mt-1 tracking-widest uppercase">Elite Optimization Rankings</p>
            </header>

            { /*Scope Toggles */}
            <div className="w-full max-w-lg bg-slate-800/40 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/50 shadow-lg flex mb-8">
                <button
                    onClick={() => setScope("global")}
                    className={`flex-11 py-2 text-sm font-semibold tracking-wide uppercase rounded-lg transition-all ${
                        scope === "global"
                            ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-cyan-500/10"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30" 
                    }`}
                >
                    Global
                </button>
                <button
                    onClick={() => setScope("regional")}
                    className={`flex-1 py-2 text-sm font-semibold tracking-wide uppercase rounded-lg transition-all ${
                        scope === "regional"
                            ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-cyan-500/10"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30" 
                    }`}
                >
                    Regional
                </button>
            </div>

            <div className="w-full max-w-lg flex flex-col gap-6">
                    {/*Visual Podium */}
                    <div className="flex items-end justify-center gap-2 sm:gap-4 px-2 pt-4 border-b border-slate-800 pb-2">
                        {podiumPlayers.map((player) => {
                            const style = getPodiumOrderStyles(player.rank);

                            return (
                                <div key={player.username} className={`flex-1 flex flex-col items-center ${style.order}`}>
                                    <div className="text-center mb-2 w-full px-1">
                                        <div className="font-bold text-xs sm:text-sm truncate max-w-[90px] sm:max-w-none mx-auto text-slate-200">
                                            {player.username}
                                        </div>
                                        <div className="text-[10px] font-mono tracking-wide text-cyan-400 font-medium">
                                            {player.xp} XP
                                        </div>
                                    </div>

                                    <div className={`w-full ${style.height} rounded-t-2xl border-t border-x ${style.border} flex flex-col items-center justify-center relative shadow-2xl`}>
                                        <span className={`text-xl sm:text-2xl font-black ${style.text}`}>{style.label}</span>
                                        <span className={`text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider`}>{player.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/*Remaining List Rows */}
                    <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {listPlayers.map((player) => (
                            <div
                                key={player.username}
                                className="flex items-center justify-between bg-slate-800/40 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-700/30 hover:border-slate-800/60 transition group"
                            >
                                <div className="flex items-center gap-4">
                                    {/*Rank Identity Circle */}
                                    <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono font-bold text-slate-400 group-hover:text-cyan-400 transition">
                                        #{player.rank}
                                    </div>

                                    <div>
                                        <div className="font-bold text-sm text-slate-200 flex items-center gap-2">
                                            {player.username}
                                            {player.region && (
                                                <span className="text-[9px] bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 font-mono">
                                                    {player.region}
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                                            Puzzles Solved: <span className="font-semibold text-slate-300 font-mono">{player.solvedCount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="font-mono text-sm font-bold text-cyan-400">
                                        +{player.xp} XP
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                        Avg: {player.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
        </div>
    );
};