import { Chessboard } from "react-chessboard";
import { useChess } from "../../providers/chess-provider";
import { useMemo } from "react";
import type { Square } from "chess.js";

export function ChessboardComponent() {
  const { 
    position, 
    placementMode,
    selectedSquare,
    handlePieceDrop, 
    handlePieceDropOffBoard, 
    handleSquareClick 
  } = useChess();

  // Create custom square styles to highlight the selected square
  const customSquareStyles = useMemo(() => {
    if (!selectedSquare) return {};
    
    // Create a highlight for the selected square
    return {
      [selectedSquare]: {
        background: "rgba(19, 146, 42, 0.5)",
        borderRadius: "4px",
        boxShadow: "inset 0 0 5px #13922A"
      }
    };
  }, [selectedSquare]);

  return (
    <div style={{ width: '85%', maxWidth: '900px', padding: '20px' }}>
      <Chessboard 
        position={position}
        customBoardStyle={{ 
          borderRadius: '4px',
          cursor: placementMode ? 'pointer' : 'grab' 
        }} 
        customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
        customDarkSquareStyle={{ backgroundColor: '#86a666' }}
        customSquareStyles={customSquareStyles}
        onPieceDrop={handlePieceDrop}
        onPieceDropOffBoard={handlePieceDropOffBoard}
        dropOffBoardAction="trash"
        id="MainChessboard"
        onSquareClick={handleSquareClick}
      />
      {placementMode && (
        <div className="bg-black text-white p-2 mt-2 text-center rounded">
          Tap on any square to place the selected piece
        </div>
      )}
      {selectedSquare && (
        <div className="bg-black text-white p-2 mt-2 text-center rounded">
          Click a destination square to move the selected piece
        </div>
      )}
    </div>
  );
} 