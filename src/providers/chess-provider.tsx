import  { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Chess, Square, Color, PieceSymbol } from "chess.js";
import type { Piece as ChessPiece } from 'react-chessboard/dist/chessboard/types';

interface ChessContextType {
  game: Chess;
  position: string;
  placementMode: boolean;
  selectedPiece: ChessPiece | null;
  selectedSquare: Square | null;
  updatePosition: () => void;
  putPiece: (piece: string, square: string) => boolean;
  clearBoard: () => void;
  resetBoard: () => void;
  removePiece: (square: string) => void;
  enterPlacementMode: (piece: ChessPiece) => void;
  exitPlacementMode: () => void;
  handlePieceDrop: (sourceSquare: Square, targetSquare: Square, piece: string) => boolean;
  handlePieceDropOffBoard: (sourceSquare: Square) => void;
  handleSquareClick: (square: Square) => boolean;
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

export function ChessProvider({ children }: { children: ReactNode }) {
  const [game] = useState(() => {
    const newGame = new Chess();
    newGame.clear();
    return newGame;
  });
  
  const [position, setPosition] = useState<string>("clear");
  const [placementMode, setPlacementMode] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<ChessPiece | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  
  const updatePosition = useCallback(() => {
    setPosition(game.fen());
  }, [game]);

  const putPiece = useCallback((piece: string, square: string) => {
    const color = piece[0] as Color;
    const type = piece[1].toLowerCase() as PieceSymbol;
    

    game.remove(square as Square);
    
    const success = game.put({ type, color }, square as Square);
    if (success) {
      updatePosition();
    }
    return success;
  }, [game, updatePosition]);

  const clearBoard = useCallback(() => {
    game.clear();
    setPosition("clear");
    setSelectedSquare(null);
  }, [game]);

  const resetBoard = useCallback(() => {
    game.reset();
    updatePosition();
    setSelectedSquare(null);
  }, [game, updatePosition]);

  const removePiece = useCallback((square: string) => {
    game.remove(square as Square);
    updatePosition();
  }, [game, updatePosition]);

  const enterPlacementMode = useCallback((piece: ChessPiece) => {
    setSelectedPiece(piece);
    setPlacementMode(true);
    setSelectedSquare(null);
  }, []);

  const exitPlacementMode = useCallback(() => {
    setSelectedPiece(null);
    setPlacementMode(false);
    setSelectedSquare(null);
  }, []);

  const handlePieceDrop = useCallback((sourceSquare: Square, targetSquare: Square, piece: string) => {
    if (sourceSquare === targetSquare) {
      return false;
    }
    
    if (sourceSquare && sourceSquare.length === 2) {
      game.remove(sourceSquare);
    }
    
    game.remove(targetSquare);
    
    const color = piece[0] as Color;
    const type = piece[1].toLowerCase() as PieceSymbol;
    const success = game.put({ type, color }, targetSquare);
    
    if (success) {
      updatePosition();
      setSelectedSquare(null);
    }
    return success;
  }, [game, updatePosition]);

  const handlePieceDropOffBoard = useCallback((sourceSquare: Square) => {
    game.remove(sourceSquare);
    updatePosition();
    setSelectedSquare(null);
  }, [game, updatePosition]);

  const handleSquareClick = useCallback((square: Square) => {
    if (placementMode && selectedPiece) {
      const color = selectedPiece[0] as Color;
      const type = selectedPiece[1].toLowerCase() as PieceSymbol;
      
      game.remove(square);
      
      const success = game.put({ type, color }, square);
      
      if (success) {
        updatePosition();
      }
      
      return success;
    } 
    else if (selectedSquare) {
      const pieceAtSquare = game.get(selectedSquare);
      
      if (pieceAtSquare) {
        try {
          const moveResult = game.move({
            from: selectedSquare,
            to: square,
          });
          
          if (moveResult) {
            updatePosition();
            setSelectedSquare(null);
            return true;
          }
        } catch (error) {
          const piece = pieceAtSquare;
          
          game.remove(selectedSquare);
          
          game.remove(square);
          
          const success = game.put(piece, square);
          
          if (success) {
            updatePosition();
            setSelectedSquare(null);
            return true;
          }
        }
      }
      
      setSelectedSquare(null);
      return false;
    } 
    else {
      const pieceAtSquare = game.get(square);
      
      if (pieceAtSquare) {
        setSelectedSquare(square);
        return true;
      }
    }
    
    return false;
  }, [game, placementMode, selectedPiece, selectedSquare, updatePosition]);

  return (
    <ChessContext.Provider
      value={{
        game,
        position,
        placementMode,
        selectedPiece,
        selectedSquare,
        updatePosition,
        putPiece,
        clearBoard,
        resetBoard,
        removePiece,
        enterPlacementMode,
        exitPlacementMode,
        handlePieceDrop,
        handlePieceDropOffBoard,
        handleSquareClick
      }}
    >
      {children}
    </ChessContext.Provider>
  );
}

export const useChess = () => {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error('useChess must be used within a ChessProvider');
  }
  return context;
}; 