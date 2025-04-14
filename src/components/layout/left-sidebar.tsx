import { useState } from 'react';
import { Moon, Gauge, Timer, Crosshair } from 'lucide-react';
import { useTheme } from '../../providers/theme-provider';
import { IconButton } from '../ui/button';
import letsTrainLogo from '../../assets/letstrainlogo.svg';

export function LeftSidebar() {
  const { theme, toggleTheme } = useTheme();
  const [activeIcon, setActiveIcon] = useState<string | null>('play');

  const toggleIcon = (icon: string) => {
    if (activeIcon === icon) {
      setActiveIcon(null);
    } else {
      setActiveIcon(icon);
    }
  };

  return (
    <div className="w-[72px] bg-[#000000] px-3 py-6 flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-12"> 
        <div className="flex justify-center">
          <img 
            src={letsTrainLogo} 
            alt="Let's Train Logo" 
            className="w-[52px] h-[36px] max-w-none" 
          />
        </div>
        
        <div className="flex flex-col space-y-6">
          <IconButton 
            variant="dark" 
            aria-label="Target/Play"
            active={activeIcon === 'play'}
            onClick={() => toggleIcon('play')}
          >
            <Crosshair className="h-6 w-6 text-white" strokeWidth={2.5} />
          </IconButton>
          <IconButton 
            variant="dark" 
            aria-label="Trophy/Leaderboard"
            active={activeIcon === 'leaderboard'}
            onClick={() => toggleIcon('leaderboard')}
          >
            <Gauge className="h-6 w-6 text-white" strokeWidth={2.5} />
          </IconButton>
          <IconButton 
            variant="dark" 
            aria-label="Timer/Stats"
            active={activeIcon === 'stats'}
            onClick={() => toggleIcon('stats')}
          >
            <Timer className="h-6 w-6 text-white" strokeWidth={2.5} />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-5 mt-auto mb-4"> 
        <IconButton 
          variant="dark"
          aria-label={`Toggle to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={toggleTheme}
          className=""
        >
          <Moon className="h-6 w-6 text-gray-300" strokeWidth={2} />
        </IconButton>
        
        <div className="w-6 h-px bg-gray-500"></div>
        
        <div 
          className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
          onClick={() => toggleIcon('profile')}
        >
          <img 
            src="https://photosrush.com/wp-content/uploads/cute-aesthetic-pfp-girl.jpg" 
            alt="Profile" 
            className="w-full h-full object-cover"
            style={activeIcon === 'profile' ? { border: '2px solid #13922A', borderRadius: '50%' } : {}}
          />
        </div>
      </div>
    </div>
  );
} 