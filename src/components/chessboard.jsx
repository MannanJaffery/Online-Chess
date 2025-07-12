import { useState } from "react";

const ChessBoard = () => {
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
    const addMove = (r, c) => moves.push({ row: r, col: c });

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
            if (!target || target.endsWith(opponentColor)) addMove(r, c);
          }
        }
        break;
      }

    }

    return moves;
  };



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
    if (!piece || !piece.endsWith(`_${turn}`)) return;
    const moves = getLegalMovesForPiece(piece, row,col,board);
    setSelectedSquare({ row, col });
    setSelectedPiece(piece);
    setValidMoves(moves);
  };

  const updateBoard = (row, col) => {
    const isValid = validMoves.some(m => m.row === row && m.col === col);
    if (!isValid || !selectedSquare || !selectedPiece) return;

    const newBoard = board.map(r => [...r]);
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


    if (isKingInCheck(opponentColor, newBoard) && is_Checkmate(opponentColor , newBoard)) {
    alert(`Checkmate! ${turn.toUpperCase()} wins!`);

    return;
  }


    

    setTurn(turn === 'w' ? 'b' : 'w');

    
    setValidMoves([]);
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
      {board.map((row, rowIndex) =>
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
