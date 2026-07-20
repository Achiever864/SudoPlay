import { useState, useEffect, useCallback } from "react";
import { useSettings } from "../context/SettingsContext";
import API from "../api/axios";

const MAX_ERRORS = 3;

type Cell = number | null;

function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function fromBoard(board: number[][]): Cell[] {
    return board.flat().map((v) => (v === 0 ? null : v));
}

export default function PlayTab() {
    const { difficulty } = useSettings();

    const [grid, setGrid] = useState<Cell[]>(Array(81).fill(null));
    const [initialIndices, setInitialIndices] = useState<number[]>([]);
    const [solution, setSolution] = useState<Cell[]>(Array(81).fill(null));
    
    const [puzzleId, setPuzzleId] = useState<string | null>(null);

    const [puzzleLoading, setPuzzleLoading] = useState(true);
    const [puzzleError, setPuzzleError] = useState<string | null>(null);

    const [selectedCell, setSelectedCell] = useState<number | null>(null);
    const [gameMode, setGameMode] = useState<"normal" | "notes">("normal");

    const [isWon, setIsWon] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const isRoundActive = !isWon && !isGameOver && !puzzleLoading;

    const [errorCount, setErrorCount] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const fetchPuzzle = useCallback(async () => {
        setPuzzleLoading(true);
        setPuzzleError(null);
        try {
        
            console.log("You can't see me.")
            const res = await API.get(`/game/start?difficulty=${difficulty}`);
            const data = res.data;
            console.log("Data hehe boy:", data);

            const flatGrid = fromBoard(data.puzzle);
            const filled = flatGrid.map((v, i) => (v !== null ? i : -1)).filter((i) => i !== -1);

            setGrid(flatGrid);
            setInitialIndices(filled);
            setSolution(data.solvedBoard ? fromBoard(data.solvedBoard) : Array(81).fill(null));
            

            setPuzzleId(data.puzzleId);

            setSelectedCell(null);
            setIsWon(false);
            setIsGameOver(false);
            setErrorCount(0);
            setElapsedSeconds(0);
        } catch (error) {
            setPuzzleError(error instanceof Error ? error.message : "Could not load puzzle");
        } finally {
            setPuzzleLoading(false);
        }
    }, [difficulty]);

    const handleWin = useCallback(
        async (timeTaken: number, mistakes: number) => {
            try {
                await API.post("/leaderboard/submit", {
                    puzzleId,
                    difficulty,
                    timeTaken,
                    mistakes,
                    hintsUsed: 0, 
                    score: Math.max(0, 1000 - timeTaken - mistakes * 50), //remeber to sort this out when you start using real scoring technique... lol
                });
            } catch (error) {
                console.error("Failed to submit leaderboard entry:", error);
            }
        },
        [puzzleId, difficulty]
    );

    useEffect(() => {
        fetchPuzzle();
    }, [difficulty]);

    useEffect(() => {
        if (!isRoundActive) return;
        const intervalId = window.setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);
        return () => window.clearInterval(intervalId);
    }, [isRoundActive]);

    const handleNumberInput = useCallback(
        (num: number | null) => {
            if (selectedCell === null) return;
            if (initialIndices.includes(selectedCell)) return;
            if (!isRoundActive) return;

            if (num !== null && num !== solution[selectedCell]) {
                setErrorCount((prev) => {
                    const next = prev + 1;
                    if (next >= MAX_ERRORS) setIsGameOver(true);
                    return next;
                });
            }

            setGrid((prevGrid) => {
                const newGrid = [...prevGrid];
                newGrid[selectedCell] = num;
                return newGrid;
            });
        },
        [selectedCell, initialIndices, isRoundActive, solution]
    );

    useEffect(() => {
        if (isWon || isGameOver) return;
        const isComplete = grid.every((cell) => cell !== null);
        if (!isComplete) return;

        const isCorrect = grid.every((cell, i) => cell === solution[i]);
        if (isCorrect) {
            setIsWon(true);
            handleWin(elapsedSeconds, errorCount);
        }
    }, [grid, isWon, isGameOver, solution, handleWin, elapsedSeconds, errorCount]);

    const handleReset = () => {
        fetchPuzzle();
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (selectedCell === null) return;

            if (/^[1-9]$/.test(event.key)) {
                handleNumberInput(parseInt(event.key, 10));
            } else if (event.key === "Backspace" || event.key === "Delete") {
                handleNumberInput(null);
            } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
                event.preventDefault();
                let row = Math.floor(selectedCell / 9);
                let col = selectedCell % 9;

                if (event.key === "ArrowUp" && row > 0) row--;
                if (event.key === "ArrowDown" && row < 8) row++;
                if (event.key === "ArrowLeft" && col > 0) col--;
                if (event.key === "ArrowRight" && col < 8) col++;

                setSelectedCell(row * 9 + col);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedCell, handleNumberInput]);

    const handleCellClick = (index: number) => {
        if (!isRoundActive) return;
        setSelectedCell(index);
    };

    return (
        <div className="w-full max-w-lg flex flex-col gap-6">
            {isWon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 border border-cyan-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-wide">
                            Solved!
                        </h2>
                        <p className="text-sm text-slate-400 mt-2">You completed the puzzle.</p>


                        <button
                            onClick={handleReset}
                            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 font-bold uppercase tracking-wider text-slate-900 transition"
                        >
                            Play again
                        </button>
                    </div>
                </div>
            )}

            {isGameOver && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 border border-rose-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600 uppercase tracking-wide">
                            Game over
                        </h2>
                        <p className="text-sm text-slate-400 mt-2">Too many mistakes. Give it another shot.</p>
                        <button
                            onClick={handleReset}
                            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 font-bold uppercase tracking-wider text-slate-900 transition"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center bg-slate-800/50 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/50 shadow-xl">
                <div className="text-sm font-medium text-slate-300">
                    Errors: <span className="text-rose-500 font-bold">{errorCount}/{MAX_ERRORS}</span>
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">{difficulty}</div>
                <div className="text-sm font-mono tracking-widest text-cyan-400 font-bold bg-slate-900/60 px-3 py-1 rounded-md border border-slate-800">
                    {formatTime(elapsedSeconds)}
                </div>
            </div>

            {puzzleError && (
                <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
                    {puzzleError}
                </div>
            )}

            <div className="w-full aspect-square bg-slate-800 rounded-2xl p-2 shadow-2xl border border-slate-700/60 grid grid-cols-9 gap-0 overflow-hidden select-none">
                {grid.map((cell, index) => {
                    const row = Math.floor(index / 9);
                    const col = index % 9;

                    const borderRight = col === 2 || col === 5 ? "border-r-2 border-r-slate-600" : "border-r border-r-slate-700/40";
                    const borderBottom = row === 2 || row === 5 ? "border-b-2 border-b-slate-600" : "border-b border-b-slate-700/40";
                    const isLastCol = col === 8 ? "border-r-0" : borderRight;
                    const isLastRow = row === 8 ? "border-b-0" : borderBottom;

                    const isSelected = selectedCell === index;
                    const isInitial = initialIndices.includes(index);

                    return (
                        <button
                            key={index}
                            onClick={() => handleCellClick(index)}
                            className={`relative flex items-center justify-center font-semibold transition-all duration-150 text-xl sm:text-2xl
                                ${isLastCol} ${isLastRow}
                                ${isSelected ? "bg-cyan-500/30 text-cyan-200" : "hover:bg-slate-700/50 text-slate-300"}
                                ${isInitial ? "font-black text-slate-400/90 bg-slate-950/20" : "text-cyan-400"}`}
                        >
                            {cell}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs font-semibold uppercase tracking-wider">
                <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700/50">
                    <span>Undo</span>
                </button>
                <button
                    onClick={() => handleNumberInput(null)}
                    className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700/50"
                >
                    <span>Erase</span>
                </button>
                <button
                    onClick={() => setGameMode(gameMode === "normal" ? "notes" : "normal")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition border ${
                        gameMode === "notes"
                            ? "bg-cyan-600/20 border-cyan-500 text-cyan-400"
                            : "bg-slate-800 hover:bg-slate-700 border-slate-700/50"
                    }`}
                >
                    <span>Notes: {gameMode === "notes" ? "ON" : "OFF"}</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700/50">
                    <span>Hint</span>
                </button>
            </div>

            <div className="grid grid-cols-9 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleNumberInput(num)}
                        className="aspect-square flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-800/80 hover:from-slate-700 hover:to-slate-700/80 active:scale-95 text-xl font-bold rounded-xl transition shadow-md border border-slate-700/40 text-cyan-400"
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
}