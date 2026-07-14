import { useState, useEffect, useCallback } from "react";
import UsernameModal from "../component/UsernameModal.tsx";

const USERNAME_STORAGE_KEY = "sudoku_username";
const MAX_ERRORS = 3;
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type Difficulty = "easy" | "medium" | "hard" | "expert";
type Cell = number | null;


//mm:ss formatting for the timer
function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function toBoard(grid: Cell[]): number[][] {
    const board: number[][] = [];
    for (let r=0; r<9; r++){
        board.push(grid.slice(r*9, r*9 + 9).map(v=> v ?? 0));
    }
    return board;
}

function fromBoard(board: number[][]): Cell[] {
    return board.flat().map(v => (v === 0 ? null : v));
}

function violatesRule(grid: Cell[], index: number, num: number): boolean{
    const row = Math.floor(index / 9);
    const col = index % 9;

    for (let c=0; c<9; c++){
        if (c !== col && grid[row * 9 +c] === num) return true;
    }

    for (let r=0; r<9; r++){
        if (r !== row && grid[r*9 + col] === num) return true;
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for(let r=0; r<3; r++){
        for(let c=0; c<3; c++){
            const i = (startRow + r) * 9 + (startCol + c);
            if (i !== index && grid[i] === num) return true;
        }
    }
    return false;
}

export default function SudokuPage() {
    //Initialized Cells
    const [grid, setGrid] = useState<Cell[]>(Array(81).fill(null));
    const [initialIndices, setInitialIndices] = useState<number[]>([]);
    const [puzzleId, setPuzzleId] = useState<string | null>(null);
    const [puzzleLoading, setPuzzleLoading] = useState(true);
    const [puzzleError, setPuzzleError] = useState<string | null>(null);


    const [selectedCell, setSelectedCell] = useState<number | null>(null);
    const [gameMode, setGameMode] = useState<"normal" | "notes">("normal");

    //Win State
    const [isWon, setIsWon] = useState(false);
    const [isGameOver, setisGameOver] = useState(false);
    const [isChecking,setIsChecking] = useState(false);

    const isRoundActive = !isWon && !isGameOver && !puzzleLoading;

    const [errorCount, setErrorCount] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const fetchPuzzle = useCallback(async (difficulty: Difficulty = "medium") => {
        setPuzzleLoading(true);
        setPuzzleError(null);
        try {
            const res = await fetch(`${API_BASE}/api/sudoku/new`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ difficulty }),
            });

            if(!res.ok) throw new Error("Failed to fetch puzzle");

            const data = await res.json();
            const flatGrid = fromBoard(data.puzzle);
            const filled = flatGrid
                .map((v, i) => (v !== null ? i : -1))
                .filter(i => i !== -1);

            setGrid(flatGrid);
            setInitialIndices(filled);

            setPuzzleId(data.puzzleId);
            setSelectedCell(null);
            setIsWon(false);
            setisGameOver(false);
            setErrorCount(0);
            setElapsedSeconds(0);
        } catch (error) {
            setPuzzleError(error instanceof Error ? error.message: "Could not load puzzle")
        } finally {
            setPuzzleLoading(false);
        }
    }, [])

    useEffect(() => {
        if (!isRoundActive) return;

        const intervalId = window.setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isRoundActive]);

    // --- Username / leaderboard identity state ---
    const [username, setUsername] = useState<string | null>(null);
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

    // On mount, check if we already have a stored username.
    // If not, prompt for one before play begins.
    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(USERNAME_STORAGE_KEY);
            if (stored) {
                setUsername(stored);
            } else {
                setIsUsernameModalOpen(true);
            }
        } catch {
            // localStorage unavailable (e.g. private mode) — just prompt each time
            setIsUsernameModalOpen(true);
        }
    }, []);

    const handleUsernameSubmit = (name: string) => {
        setUsername(name);
        setIsUsernameModalOpen(false);
        try {
            window.localStorage.setItem(USERNAME_STORAGE_KEY, name);
        } catch {
            // ignore storage errors, name still works for this session
        }
    };

    // Core function to update a cell's value
    const handleNumberInput = useCallback((num: number | null) => {
        if (selectedCell === null) return;

        // Don't overwrite initial fixed puzzle numbers
        if (initialIndices.includes(selectedCell)) return;
        if (!isRoundActive) return;

        if (num !== null && num !== SOLUTION[selectedCell]){
            setErrorCount(prev => {
                const next = prev + 1;
                if (next >= MAX_ERRORS){ 
                    setisGameOver(true);
                }
                return next;
            });
        }

        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            newGrid[selectedCell] = num;
            return newGrid;
        });
    }, [selectedCell, initialIndices, isRoundActive]);

    useEffect(() => {
        if (isWon || isGameOver) return;
        const isComplete = grid.every(cell => cell !== null);
        if (!isComplete) return;

        const isCorrect = grid.every((cell, i) => cell === SOLUTION[i]);
        if (isCorrect){
            setIsWon(true);
        }
    }, [grid, isWon, isGameOver]);

    const handleReset = () => {
        setGrid(buildInitialGrid());
        setSelectedCell(null);
        setIsWon(false);
        setisGameOver(false);
        setErrorCount(0);
        setElapsedSeconds(0);
    };

    // Handle physical keyboard typing
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isUsernameModalOpen) return; // don't let game input fire while modal is open
            if (selectedCell === null) return;

            // Detect numbers 1-9
            if (/^[1-9]$/.test(event.key)) {
                handleNumberInput(parseInt(event.key, 10));
            }
            // Detect Backspace or Delete to clear a cell
            else if (event.key === "Backspace" || event.key === "Delete") {
                handleNumberInput(null);
            }
            // Optional: Use Arrow keys to navigate the board
            else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
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
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedCell, handleNumberInput, isUsernameModalOpen, isWon]);

    const handleCellClick = (index: number) => {
        if (!isRoundActive) return;
        setSelectedCell(index);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 antialiased">
            <UsernameModal isOpen={isUsernameModalOpen} onSubmit={handleUsernameSubmit} />

            {isWon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 border border-cyan-500/40 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
                        <div className="text-5xl mb-3">Congratulations</div>
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-wide">
                            Solved!
                        </h2>
                        <p className="text-sm text-slate-400 mt-2">
                            {username ? `Nice work, ${username}.` : "Nice work."} You completed the puzzle.
                        </p>
                        <button
                            onClick={handleReset}
                            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 font-bold uppercase tracking-wider text-slate-900 transition"
                        >   
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            {/*For Game over part */}
            {isGameOver && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 border border-rose-500/40 rounded-2xl shadow-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
                        <div className="text-5xl mb-3">!!</div>
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600 uppercase tracking-wide">
                            Game Over
                        </h2>
                        <p className="text-sm text-slate-400 mt-2">
                            Too many mistakes. Give it another shot.
                        </p>
                        <button
                            onClick={handleReset}
                            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 font-bold uppercase tracking-wider text-slate-900 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}


            {/* Header */}
            <header className="mb-8 text-center relative w-full max-w-lg">
                <h1 className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
                    Sudoku
                </h1>
                <p className="text-xs text-slate-400 mt-1 tracking-widest uppercase">Difficulty: Medium</p>

                {username && (
                    <button
                        onClick={() => setIsUsernameModalOpen(true)}
                        className="absolute right-0 top-1 text-xs text-slate-400 hover:text-cyan-400 transition flex items-center gap-1.5 group"
                        title="Change your leaderboard name"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:bg-cyan-400" />
                        {username}
                    </button>
                )}
            </header>

            {/* Main Layout Container */}
            <div className="w-full max-w-lg flex flex-col gap-6">
                {/* Top Controls/ Status */}
                <div className="flex justify-between items-center bg-slate-800/50 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/50 shadow-xl">
                    <div className="text-sm font-medium text-slate-300">
                        Errors: <span className="text-rose-500 font-bold">{errorCount}/{MAX_ERRORS}</span>
                    </div>
                    <div className="text-sm font-mono tracking-widest text-cyan-400 font-bold bg-slate-900/60 px-3 py-1 rounded-md border border-slate-800">
                        {formatTime(elapsedSeconds)}
                    </div>
                </div>

                {/* Sudoku Grid */}
                <div className="w-full aspect-square bg-slate-800 rounded-2xl p-2 shadow-2xl border border-slate-700/60 grid grid-cols-9 gap-0 overflow-hidden select-none">
                    {grid.map((cell, index) => {
                        const row = Math.floor(index / 9);
                        const col = index % 9;

                        const borderRight = (col === 2 || col === 5) ? "border-r-2 border-r-slate-600" : "border-r border-r-slate-700/40";
                        const borderBottom = (row === 2 || row === 5) ? "border-b-2 border-b-slate-600" : "border-b border-b-slate-700/40";
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

                {/* Action Control */}
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
                        onClick={() => setGameMode(gameMode === 'normal' ? "notes" : "normal")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition border ${
                            gameMode === "notes"
                                ? "bg-cyan-600/20 border-cyan-500 text-cyan-400"
                                : "bg-slate-800 hover:bg-slate-700 border-slate-700/50" 
                        }`}
                    >
                        <span>Notes: {gameMode === "notes" ? "ON" : 'OFF'}</span>
                    </button>

                    <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700/50">
                        <span>Hint</span>
                    </button>
                </div>
                
                {/* Number Input Keypad */}
                <div className="grid grid-cols-9 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberInput(num)} // Wired up virtual keypad click
                            className="aspect-square flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-800/80 hover:from-slate-700 hover:to-slate-700/80 active:scale-95 text-xl font-bold rounded-xl transition shadow-md border border-slate-700/40 text-cyan-400"
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}