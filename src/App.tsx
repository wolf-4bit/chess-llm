import { LeftSidebar, RightSidebar } from '@/components/layout';
import { ChessboardComponent } from '@/components/chess';
import { ChessboardDnDProvider } from 'react-chessboard';
import { ChessProvider } from './providers/chess-provider';

function App() {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <LeftSidebar />
      <div className="w-[15%]"></div>
      <ChessProvider>
        <ChessboardDnDProvider>
          <div className="flex flex-grow items-stretch">
            <ChessboardComponent />
            <div className="flex-grow flex">
              <RightSidebar />
            </div>
          </div>
        </ChessboardDnDProvider>
      </ChessProvider>
    </div>
  );
}

export default App;