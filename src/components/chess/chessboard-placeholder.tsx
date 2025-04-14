import React from 'react';

export function ChessboardPlaceholder() {
  // Define board dimensions
  const boardSize = 512; // px
  const squareSize = boardSize / 8;
  
  // Create the 8x8 grid of alternating colors
  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        squares.push(
          <div 
            key={`${row}-${col}`}
            style={{
              width: `${squareSize}px`,
              height: `${squareSize}px`,
              backgroundColor: isLight ? '#1F1F1F' : '#C0C0C0',
            }}
          />
        );
      }
    }
    return squares;
  };

  return (
    <div className="flex-grow bg-[#000000] flex items-center justify-center p-4">
      <div 
        className="grid grid-cols-8 grid-rows-8"
        style={{ width: `${boardSize}px`, height: `${boardSize}px` }}
      >
        {renderBoard()}
      </div>
    </div>
  );
} 