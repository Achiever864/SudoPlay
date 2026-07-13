import { BrowserRouter, Routes, Route } from "react-router-dom";
import LeaderboardPage from "./pages/LeaderboarPage";
import SudokuPage from "./pages/SudokuPage";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SudokuPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;