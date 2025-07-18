import { useParams } from "react-router-dom"
import ChessBoard from "../components/chessboard"
import { useState } from "react";
const OnlineGame = () => {
  const {gameid} = useParams();
  const [copied , setCopied] = useState(false);



  const handlecopy  = ()=>{
    navigator.clipboard.writeText(gameid);
    setCopied(true);
  }
  return (
    <div>

  
        <ChessBoard isOnline = {true}
        gameid={gameid}/>
<div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md w-fit">
  <span className="text-sm font-mono">ID: {gameid}</span>
  <button
    onClick={handlecopy}
    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
  >
    {copied ? "Copied" : "Copy"}
  </button>
</div>

    </div>
  )
}

export default OnlineGame
