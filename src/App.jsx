import { BrowserRouter , Route ,Routes } from "react-router-dom";
import ChessBoard from "./components/chessboard";
import Username from "./pages/username";
import Modes from "./pages/modes";

function App() {
  return(
<>


<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Username />} />
    <Route path="/offline" element={<ChessBoard />} />
    <Route path="/modes" element={<Modes />} />
  </Routes>
</BrowserRouter>

<div className=" min-h-screen flex justify-center items-center">

</div>


</>
  );
}

export default App;
