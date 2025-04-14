import { useState, useEffect, useRef, useCallback } from 'react';
import { SparePiece } from 'react-chessboard';
import type { Piece as ChessPiece } from 'react-chessboard/dist/chessboard/types';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { useChess } from '../../providers/chess-provider';
import { cn } from '../../lib/utils';

const selectTriggerClasses = "inline-flex items-center justify-between rounded-md px-4 py-2 text-sm leading-none h-9 gap-1 bg-[#222] text-white border border-[#444] hover:bg-[#333] focus:outline-none w-full";
const selectItemClasses = "text-sm rounded flex items-center h-8 pr-9 pl-6 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-[#8BC34A] data-[highlighted]:text-white cursor-pointer";

export function RightSidebar() {
  const { 
    selectedPiece,
    enterPlacementMode,
    exitPlacementMode,
    resetBoard,
    game,
  } = useChess();
  
  const [trainingMode, setTrainingMode] = useState('coordinates');
  const [color, setColor] = useState('white');
  const [showCoordinates, setShowCoordinates] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!selectedPiece || !sidebarRef.current) return;
      
      if (!sidebarRef.current.contains(event.target as Node)) {
        const chessboard = document.getElementById('MainChessboard');
        if (!chessboard || !chessboard.contains(event.target as Node)) {
          exitPlacementMode();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [selectedPiece, exitPlacementMode]);

  const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];

  const handlePieceClick = (piece: ChessPiece) => {
    enterPlacementMode(piece);
  };
  
  const handleStartClick = () => {
    resetBoard();
  };

  const handleDoubleClick = useCallback(() => {
    if (selectedPiece) {
      exitPlacementMode();
    }
  }, [selectedPiece, exitPlacementMode]);

  return (
    <div 
      ref={sidebarRef}
      className="w-full h-full bg-black p-4 overflow-auto flex flex-col items-center"
      onDoubleClick={handleDoubleClick}
    >
      <div className="w-full mb-4">
        <div className="flex bg-[#222] p-3 rounded-lg my-[5px] justify-center shadow-lg w-full">
          {pieces.slice(6, 12).map(piece => 
            <div 
              className={cn(
                "mx-[6px] cursor-pointer flex justify-center items-center w-[16.666%] p-[2px]",
                selectedPiece === piece ? "bg-[rgba(19,146,42,0.5)] rounded shadow-[0_0_5px_#13922A]" : ""
              )}
              key={piece}
              onClick={() => handlePieceClick(piece as ChessPiece)}
            >
              <SparePiece 
                piece={piece as ChessPiece} 
                width={70} 
                dndId="MainChessboard" 
              />
            </div>
          )}
        </div>
        
        <div className="flex bg-[#222] p-3 rounded-lg my-[5px] justify-center shadow-lg w-full">
          {pieces.slice(0, 6).map(piece => 
            <div 
              className={cn(
                "mx-[6px] cursor-pointer flex justify-center items-center w-[16.666%] p-[2px]",
                selectedPiece === piece ? "bg-[rgba(19,146,42,0.5)] rounded shadow-[0_0_5px_#13922A]" : ""
              )}
              key={piece}
              onClick={() => handlePieceClick(piece as ChessPiece)}
            >
              <SparePiece 
                piece={piece as ChessPiece} 
                width={70} 
                dndId="MainChessboard"
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full mb-5">
        <input 
          className="w-full py-3 px-4 bg-[#222] text-white rounded-lg border border-[#444] text-base outline-none"
          type="text"
          placeholder="Enter FEN notation..."
          value={game.fen()}
          readOnly
        />
      </div>

      <div className="w-full mb-4">
        <div className="text-center my-5">
          <div className="text-sm text-[#6b7280] uppercase tracking-wider">Personal Best</div>
          <div className="text-5xl font-bold text-white leading-none">10</div>
        </div>
      </div>

      <div className="w-full mt-auto pb-5">
        <div className="mb-4">
          <div className="flex gap-4 mb-2">
            <div className="flex-1">
              <div className="text-gray-300 text-sm mb-1">Training Mode</div>
              <Select.Root value={trainingMode} onValueChange={setTrainingMode}>
                <Select.Trigger className={selectTriggerClasses} aria-label="Training Mode">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-[#222] text-white rounded-md shadow-lg border border-[#444]">
                    <Select.Viewport className="p-1">
                      <Select.Item value="coordinates" className={selectItemClasses}>
                        <Select.ItemText>Coordinates</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="tactics" className={selectItemClasses}>
                        <Select.ItemText>Tactics</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="endgames" className={selectItemClasses}>
                        <Select.ItemText>Endgames</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="flex-1">
              <div className="text-gray-300 text-sm mb-1">Color</div>
              <Select.Root value={color} onValueChange={setColor}>
                <Select.Trigger className={selectTriggerClasses} aria-label="Color">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-[#222] text-white rounded-md shadow-lg border border-[#444]">
                    <Select.Viewport className="p-1">
                      <Select.Item value="white" className={selectItemClasses}>
                        <Select.ItemText>White</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="black" className={selectItemClasses}>
                        <Select.ItemText>Black</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="random" className={selectItemClasses}>
                        <Select.ItemText>Random</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>

          <div className="flex items-center justify-center mb-3">
            <Checkbox.Root 
              className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-[#222] hover:bg-[#333] border border-gray-600 outline-none"
              checked={showCoordinates}
              onCheckedChange={(checked) => setShowCoordinates(checked === true)}
              id="show-coordinates"
            >
              <Checkbox.Indicator className="text-white">
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label 
              className="pl-2 text-gray-300 text-sm cursor-pointer" 
              htmlFor="show-coordinates"
            >
              Show Coordinates
            </label>
          </div>
        </div>

        <button 
          className="w-full py-4 bg-[#8BC34A] text-white border-none rounded-lg cursor-pointer text-3xl font-bold uppercase shadow-md"
          onClick={handleStartClick}
        >
          Start
        </button>
      </div>
    </div>
  );
}
