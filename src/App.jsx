import { BrowserRouter , Route ,Routes } from "react-router-dom";
import ChessBoard from "./components/chessboard";
import Username from "./pages/username";
import Modes from "./pages/modes";
import OnlineGame from "./pages/onlinegame";
import CreateRoom from "./components/createroom";
import Local from "./pages/localgame";
import { UserProvider } from "./context/Usercontext";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  return(
<>


<BrowserRouter>
<UserProvider>
  <Routes>
    <Route path="/" element={<Username />} />

    <Route path="/offline" element={
      <ProtectedRoute>
      <Local />
      </ProtectedRoute>
      } />
    <Route path="/modes" element={
      <ProtectedRoute>
      <Modes />
      </ProtectedRoute>
      } />
    <Route path="/online/:gameid" element={
      <ProtectedRoute>
      <OnlineGame />
      </ProtectedRoute>
      }/>
    <Route path="/createroom" element= {
      <ProtectedRoute>
      <CreateRoom />
      </ProtectedRoute>
      }/>
  </Routes>
</UserProvider>
</BrowserRouter>

<div className=" min-h-screen flex justify-center items-center">

</div>


</>
  );
}

export default App;
