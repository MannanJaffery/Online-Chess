import { BrowserRouter , Route ,Routes } from "react-router-dom";
import ChessBoard from "./components/chessboard";
import Username from "./pages/username";
import Modes from "./pages/modes";
import OnlineGame from "./pages/onlinegame";
import CreateRoom from "./components/createroom";
import Local from "./pages/localgame";

function App() {
  return(
<>


<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Username />} />
    <Route path="/offline" element={<Local />} />
    <Route path="/modes" element={<Modes />} />
    <Route path="/online/:gameid" element={<OnlineGame />}/>
    <Route path="/createroom" element= {<CreateRoom />}/>
  </Routes>
</BrowserRouter>

<div className=" min-h-screen flex justify-center items-center">

</div>


</>
  );
}

export default App;
