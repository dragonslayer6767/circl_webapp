import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: COLORS.primary }}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-between shadow-sm">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/forum')}
        >
          <span className="text-2xl font-bold text-white hidden sm:block">
            Circl.
          </span>
        </div>


      </div>
    </header>
  );
}
