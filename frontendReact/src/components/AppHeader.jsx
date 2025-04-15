import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { logout, clearError } from '../stores/userSlice';
import { TrophyIcon, CheckCircleIcon, XCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import LoginPopup from './LoginPopup';

const AppHeader = () => {
  const { username, score: userTotalScore, isAuthenticated } = useSelector((state) => state.user);
  const { score: gameScore, correctAnswers, incorrectAnswers } = useSelector((state) => state.game);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const isGameRoute = location.pathname.startsWith('/game');

  const handleLogout = () => {
    dispatch(logout());
  };

  const openLoginPopup = () => {
    dispatch(clearError()); // Clear any previous errors
    setIsLoginOpen(true);
  };

  const displayScore = isGameRoute ? gameScore : userTotalScore;

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1 flex justify-start items-center">
            <Link to="/" className="flex items-center text-white hover:opacity-90 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="text-xl font-bold">Globetrotter</span>
            </Link>
          </div>
          
          <div className="flex-shrink-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-5 py-2 flex items-center justify-center space-x-6">
              <div className="flex items-center text-yellow-300" title="Score">
                <TrophyIcon className="h-5 w-5 mr-1.5" />
                <span className="font-bold text-white text-sm sm:text-base">{isAuthenticated ? displayScore : '0'}</span>
              </div>
              <div className="flex items-center text-green-400" title="Correct Answers">
                <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                <span className="font-bold text-white text-sm sm:text-base">{isAuthenticated ? correctAnswers : '0'}</span>
              </div>
              <div className="flex items-center text-red-400" title="Incorrect Answers">
                <XCircleIcon className="h-5 w-5 mr-1.5" />
                <span className="font-bold text-white text-sm sm:text-base">{isAuthenticated ? incorrectAnswers : '0'}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium mr-2 truncate max-w-[120px]" title={username}>{username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
                  title="Sign out"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5"/>
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginPopup}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md text-base font-medium transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Popup */}
      <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
};

export default AppHeader; 