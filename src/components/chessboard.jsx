import { collection, getDoc , getDocs , doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { query , where   } from "firebase/firestore";
import { auth } from "../firebase";

const ChessBoard = ({isOnline =false, gameid=null}) => {

  useEffect(() => {
    const func = async () => {
      if (!isOnline || !gameid) return;

      try {
        const docRef = doc(db, "games", gameid);
        const gameSnap = await getDoc(docRef);

        if (!gameSnap.exists()) {
          console.log("Game does not exist");
          return;
        }

        const gameData = gameSnap.data();
        console.log("Game exists:", gameData);


        if (!auth.currentUser || !auth.currentUser.uid) {
          console.log("User not authenticated yet");
          return;
        }

        const userSnap = await getDocs(
          query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
        );
        const currentUsername = userSnap.docs[0]?.data().username;

        console.log("current user name " , currentUsername);
        

        if(!gameData.player2){
          if(gameData.player1!=currentUsername){
            await updateDoc(docRef , {
              player2:currentUsername,
              status:"active",
            })
          }
        }

        console.log("Current user in func:", currentUsername);
      } catch (err) {
        console.error("Error in func:", err);
      }
    };

    func();
  }, [isOnline, gameid]); //when a user joins with a direct link then what , we have to refresh(later fix)

  const initialBoard = [['r_b','n_b','b_b','q_b','k_b','b_b','n_b','r_b'],
    ['p_b','p_b','p_b','p_b','p_b','p_b','p_b','p_b'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['p_w','p_w','p_w','p_w','p_w','p_w','p_w','p_w'],
    ['r_w','n_w','b_w','q_w','k_w','b_w','n_w','r_w'],
  ];

  const [board, setBoard] = useState([
    ['r_b','n_b','b_b','q_b','k_b','b_b','n_b','r_b'],
    ['p_b','p_b','p_b','p_b','p_b','p_b','p_b','p_b'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['p_w','p_w','p_w','p_w','p_w','p_w','p_w','p_w'],
    ['r_w','n_w','b_w','q_w','k_w','b_w','n_w','r_w'],
  ]);



  const [validMoves, setValidMoves] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [turn, setTurn] = useState('w');
  const [kingChecked, setKingChecked] = useState(null);
  const [lastmove, setLastMove] = useState(null);

  const [onlineplayercolor, setOnlinePlayerColor] = useState('w');

  const [castleRights, setCastleRights] = useState({
  w_kingMoved: false,
  w_rookLeftMoved: false,
  w_rookRightMoved: false,
  b_kingMoved: false,
  b_rookLeftMoved: false,
  b_rookRightMoved: false,
});


  const directions = {
    knight: [[-2, 1], [-2, -1], [-1, 2], [-1, -2], [1, 2], [1, -2], [2, 1], [2, -1]],
    bishop: [[1,1],[1,-1],[-1,-1],[-1,1]],
    rook: [[0,1],[1,0],[0,-1],[-1,0]],
    queen: [[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,-1],[-1,1]],
    king: [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]],
  };
  

  const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

 const squareattacked = (row, col, byColor, boardState = board) => {
  const opponentMoves = getOpponentMoves(byColor, boardState);
  return opponentMoves.some(m => m.row === row && m.col === col);
};

  const getMovesForPiece = (piece, row, col, boardState = board , flag=false) => {

    const moves = [];
    const isWhite = piece.endsWith('_w');
    const opponentColor = isWhite ? '_b' : '_w';
    const addMove = (r, c , extra={}) => moves.push({ row: r, col: c,...extra });

    switch (piece) {
      case 'p_w':
      case 'p_b': {
        const dir = piece === 'p_w' ? -1 : 1;
        const startRow = piece === 'p_w' ? 6 : 1;

        if (inBounds(row + dir, col) && boardState[row + dir][col] === '') {
          addMove(row + dir, col);
          if (row === startRow && boardState[row + 2 * dir][col] === '') {
            addMove(row + 2 * dir, col);
          }
        }

        for (let dc of [-1, 1]) {
          const c = col + dc;
          if (inBounds(row + dir, c)) {
            const target = boardState[row + dir][c];
            if (target && target.endsWith(opponentColor)) addMove(row + dir, c);
          }
        }

        
          if (lastmove && lastmove.piece.startsWith('p_')) {
            const isEnemyDoubleStep = 
              Math.abs(lastmove.from.row - lastmove.to.row) === 2 &&
              lastmove.to.row === row && 
              Math.abs(lastmove.to.col - col) === 1 && 
              lastmove.piece.endsWith(opponentColor);

            if (isEnemyDoubleStep) {
              const direction = piece === 'p_w' ? -1 : 1;
              addMove(row + direction, lastmove.to.col, { enPassant: true });
            }
          }

        break;
      }
      case 'n_w':
      case 'n_b': {
        for (let [dr, dc] of directions.knight) {
          const r = row + dr, c = col + dc;
          if (inBounds(r, c)) {
            const target = boardState[r][c];
            if (!target || target.endsWith(opponentColor)) addMove(r, c);
          }
        }
        break;
      }
      case 'b_w':
      case 'b_b': {
        for (let [dr, dc] of directions.bishop) {
          let r = row + dr, c = col + dc;
          while (inBounds(r, c)) {
            const target = boardState[r][c];
            if (!target) addMove(r, c);
            else {
              if (target.endsWith(opponentColor)) addMove(r, c);
              break;
            }
            r += dr; c += dc;
          }
        }
        break;
      }
      case 'r_w':
      case 'r_b': {
        for (let [dr, dc] of directions.rook) {
          let r = row + dr, c = col + dc;
          while (inBounds(r, c)) {
            const target = boardState[r][c];
            if (!target) addMove(r, c);
            else {
              if (target.endsWith(opponentColor)) addMove(r, c);
              break;
            }
            r += dr; c += dc;
          }
        }
        break;
      }
      case 'q_w':
      case 'q_b': {
        for (let [dr, dc] of directions.queen) {
          let r = row + dr, c = col + dc;
          while (inBounds(r, c)) {
            const target = boardState[r][c];
            if (!target) addMove(r, c);
            else {
              if (target.endsWith(opponentColor)) addMove(r, c);
              break;
            }
            r += dr; c += dc;
          }
        }
        break;
      }
      case 'k_w':
      case 'k_b': {

        if(!flag){
            // For WHITE
            if (!castleRights.w_kingMoved && !isKingInCheck('w', boardState)) {

              if (
                !castleRights.w_rookRightMoved &&
                boardState[7][5] === '' &&
                boardState[7][6] === '' &&
                !squareattacked(7,5,'b') &&
                !squareattacked(7,6,'b')
              ) {
                addMove(7,6); 
              }

              if (
                !castleRights.w_rookLeftMoved &&
                boardState[7][1] === '' &&
                boardState[7][2] === '' &&
                boardState[7][3] === '' &&
                !squareattacked(7,2,'b') &&
                !squareattacked(7,3,'b')
              ) {
                addMove(7,2); 
              }
            }

            // For BLACK
            if (!castleRights.b_kingMoved && !isKingInCheck('b', boardState)) {
            
              if (
                !castleRights.b_rookRightMoved &&
                boardState[0][5] === '' &&
                boardState[0][6] === '' &&
                !squareattacked(0,5,'w') &&
                !squareattacked(0,6,'w')
              ) {
                addMove(0,6);
              }

              if (
                !castleRights.b_rookLeftMoved &&
                boardState[0][1] === '' &&
                boardState[0][2] === '' &&
                boardState[0][3] === '' &&
                !squareattacked(0,2,'w') &&
                !squareattacked(0,3,'w')
              ) {
                addMove(0,2);
              }
            }

          }




        for (let [dr, dc] of directions.king) {
          const r = row + dr, c = col + dc;
          if (inBounds(r, c)) {


            const target = boardState[r][c];
            
            if ((!target || target.endsWith(opponentColor)) && !squareattacked(r, c, opponentColor)) addMove(r, c);
          }
        }
        break;
      }

    }

    return moves;
  };



useEffect(() => {

  if (isOnline && gameid){
    const unsubscribe = onSnapshot(doc(db, "games", gameid), (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data();

        const fetchedBoard = gameData.board;

        let boardToSet = initialBoard;
        if (Array.isArray(fetchedBoard)) {
          if (Array.isArray(fetchedBoard[0])) {
            boardToSet = fetchedBoard;
          } else if (fetchedBoard.length === 64) {
            boardToSet = Array.from({ length: 8 }, (_, i) => fetchedBoard.slice(i * 8, i * 8 + 8));
          }
        }

        setBoard(boardToSet);
        setTurn(gameData.turn);
        setLastMove(gameData.lastmove);


      }
    });

    return () => unsubscribe();
  }
}, [isOnline, gameid]);



useEffect(() => {
  const fetchPlayerColor = async () => {
    if (!isOnline || !gameid ) return;
    if (!auth.currentUser) {
  console.log("auth.currentUser not ready yet.");
  return;
}

    try {
      console.log("just hello")
      const userSnap = await getDocs(
        query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))
      );
      console.log("hello 1")
      const currentUsername = userSnap.docs[0]?.data()?.username;
      console.log("hello 2");
      const gameSnap = await getDoc(doc(db, "games", gameid));
      const gameData = gameSnap.data();



      if (gameData.player1 === currentUsername) {
        setOnlinePlayerColor('w');
      } else if (gameData.player2 === currentUsername) {
        setOnlinePlayerColor('b');
      }


      console.log("online player collor after setting ",onlineplayercolor)

    } catch (err) {
      console.error("Error determining player color:", err);
    }
  };

  fetchPlayerColor();
}, [isOnline, gameid , auth.currentUser]);




  const getLegalMovesForPiece = (piece, row, col, boardState = board) => {
  const allMoves = getMovesForPiece(piece, row, col, board);
  const isWhite = piece.endsWith('_w');
  const playerColor = isWhite ? 'w' : 'b';
  
  
  const legalMoves = allMoves.filter(move => {
    const testBoard = boardState.map(r => [...r]);

    // Simulate the move
    testBoard[move.row][move.col] = piece;
    testBoard[row][col] = '';

    // Is the king in check after this move?
    return !isKingInCheck(playerColor, testBoard);
  });

  return legalMoves;
};

  const getKingPosition = (color, boardState = board) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (boardState[r][c] === `k_${color}`) return { row: r, col: c };
      }
    }
    return null;
  };

  const getOpponentMoves = (color, boardState = board) => {
    let moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = boardState[r][c];
        if (p && p.endsWith(`_${color}`)) {
          moves.push(...getMovesForPiece(p, r, c, boardState,true));
        }
      }
    }
    return moves;
  };

  const isKingInCheck = (color, boardState = board) => {
    const kingPos = getKingPosition(color, boardState);
    const opponentColor = color === 'w' ? 'b' : 'w';
    const opponentMoves = getOpponentMoves(opponentColor, boardState);
    return opponentMoves.some(m => m.row === kingPos.row && m.col === kingPos.col);
  };

const selectSquareWithPiece = (row, col, piece) => {
  console.log("Clicked square:", { row, col, piece });

  if (!piece) {
    console.log("No piece found on this square.");
    return;
  }

  if (isOnline) {
    console.log("Online mode active");
    console.log("Piece clicked:", piece);
    console.log("Online player color:", onlineplayercolor);
    console.log("Game turn:", turn);

    if (!onlineplayercolor) {
      console.log("Online player color not set yet.");
      return;
    }

    if (turn !== onlineplayercolor) {
      console.log("Not your turn.");
      return;
    }

    if (!piece.endsWith(`_${onlineplayercolor}`)) {
      console.log("You clicked opponent's piece.");
      return;
    }

  } else {
    //offline
    if (!piece.endsWith(`_${turn}`)) {
      console.log("Offline: Not your piece.");
      return;
    }
  }
    const moves = getLegalMovesForPiece(piece, row,col,board);
    setSelectedSquare({ row, col });
    setSelectedPiece(piece);
    setValidMoves(moves);

  };





  const updateBoard = async (row, col) => {

    const isValid = validMoves.some(m => m.row === row && m.col === col);
    
    if (!isValid || !selectedSquare || !selectedPiece) return;

    const move = validMoves.find(move=>move.row===row&&move.col===col);

    
    const newBoard = board.map(r => [...r]);

    if(move?.enPassant){
      const capturedrow = turn==='w'? row+1:row-1;
      newBoard[capturedrow][col]='';
    }
    
    newBoard[row][col] = selectedPiece;
    newBoard[selectedSquare.row][selectedSquare.col] = '';
    setBoard(newBoard);

    const opponentColor = selectedPiece.endsWith('_w') ? 'b' : 'w';
    const kingPos = getKingPosition(opponentColor, newBoard);
     
    ///white castling
    if (selectedPiece === 'k_w') {
  setCastleRights(prev => ({ ...prev, w_kingMoved: true }));

  // White kingside castling
  if (selectedSquare.row === 7 && selectedSquare.col === 4 && row === 7 && col === 6) {
    newBoard[7][5] = 'r_w'; // move rook
    newBoard[7][7] = '';     // clear original rook square
  }

  // White queenside castling
  if (selectedSquare.row === 7 && selectedSquare.col === 4 && row === 7 && col === 2) {
    newBoard[7][3] = 'r_w';
    newBoard[7][0] = '';
  }
}

    if(selectedPiece==='r_w' && selectedSquare===0) setCastleRights(prev=>({...prev,w_rookLeftMoved:true}));
    if(selectedPiece === 'r_w' && selectedSquare===7) setCastleRights(prev=>({...prev,w_rookRightMoved:true}))

   //black castling

   if (selectedPiece === 'k_b') {
  setCastleRights(prev => ({ ...prev, b_kingMoved: true }));

  // Black kingside castling
  if (selectedSquare.row === 0 && selectedSquare.col === 4 && row === 0 && col === 6) {
    newBoard[0][5] = 'r_b';
    newBoard[0][7] = '';
  }

  // Black queenside castling
  if (selectedSquare.row === 0 && selectedSquare.col === 4 && row === 0 && col === 2) {
    newBoard[0][3] = 'r_b';
    newBoard[0][0] = '';
  }
}
    if(selectedPiece==='r_b' && selectedSquare===0) setCastleRights(prev=>({...prev,b_rookLeftMoved:true}));
   

    if(selectedPiece === 'r_b' && selectedSquare===7) setCastleRights(prev=>({...prev,b_rookRightMoved:true}))


    if (isKingInCheck(opponentColor, newBoard)) {
      setKingChecked(kingPos);
      
    } else {
      setKingChecked(null);
    }


    

  //   if (isKingInCheck(opponentColor, newBoard) && is_Checkmate(opponentColor , newBoard)) {
  //   alert(`Checkmate! ${turn.toUpperCase()} wins!`);

  //   return;
  // }




  //last move
  setLastMove({
    piece:selectedPiece,
    from:{row:selectedSquare.row,col:selectedSquare.col},
    to:{row,col},
  })


  if(isOnline){
    await updateDoc(doc(db,"games" , gameid),{
      lastmove:{
        piece:selectedPiece,
        from:{row:selectedSquare.row,col:selectedSquare.col},
        to:{row,col},
      }
    })
  }

  



    setTurn(turn === 'w' ? 'b' : 'w');

    
    setValidMoves([]);

    if (isOnline && gameid) {
    try {
      await updateDoc(doc(db, "games", gameid), {
        board: newBoard.flat(),
        turn: turn ==='w' ? 'b' : 'w',
        lastMove: {
          piece: selectedPiece,
          from: { row: selectedSquare.row, col: selectedSquare.col },
          to: { row, col },
        }
      });
    } catch (error) {
      console.error("Failed to update move in Firestore:", error);
    }
  }
  };


  const is_Checkmate = (color , boardstate=board)=>{

    for(let i=0;i<8;i++){
      for(let j=0;j<8;j++){
        const p = boardstate[i][j];

        if(p&&p.endsWith(color)){
          const legalmoves = getLegalMovesForPiece(p,i,j, boardstate);
          if(legalmoves.length>0) return false;
        }
      }
    }

    return true;
  }


  return (
    <div className="grid grid-cols-8 w-full max-w-[512px] aspect-square mx-auto rounded-md overflow-hidden">
      {board?.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          const isDark = (rowIndex + colIndex) % 2 === 1;
          const squareColor = isDark ? "bg-[#769656]" : "bg-[#eeeed2]";
          const piece = square;
          const isValid = validMoves.some(
            m => m.row === rowIndex && m.col === colIndex
          );
          const isChecked =
            kingChecked?.row === rowIndex && kingChecked?.col === colIndex;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`relative aspect-square ${squareColor} flex items-center justify-center 
                ${piece ? 'cursor-pointer' : ''} 
                ${isValid ? 'ring-4 ring-yellow-400' : ''}
                ${isChecked ? 'bg-red-500 animate-pulse' : ''}`}
              onClick={() => {
                if (isValid) {
                  updateBoard(rowIndex, colIndex);
                } else {
                  selectSquareWithPiece(rowIndex, colIndex, piece);
                }
              }}
            >
              {piece && (
                <img
                  src={`/${piece}.png`}
                  alt={piece}
                  className="w-full h-full object-contain p-1 select-none pointer-events-none"
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );

};
export default ChessBoard;





//write now , enpassant, not working in online 