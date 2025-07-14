import { useParams } from "react-router-dom"
import ChessBoard from "../components/chessboard"
const OnlineGame = () => {
  const {gameid} = useParams();
  return (
    <div>

  
        <ChessBoard isOnline = {true}
        gameid={gameid}/>

        <h1>id:{gameid}</h1>
    </div>
  )
}

export default OnlineGame
