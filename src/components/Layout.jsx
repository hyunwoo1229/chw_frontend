import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Music,
  LogOut,
  User,
  LogIn,
  UserPlus,
  PlusCircle,
} from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('name');

  // 모든 페이지 진입 시 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const pathname = location.pathname;
  const hideSongButton = ['/chat', '/music', '/board/write'].some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md shadow-lg px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer ml-2" onClick={() => navigate('/')}> {/* 홈 이동 */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Music size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold">MusicBoard</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap ml-auto">
            {userName ? (
              <>
                {!hideSongButton && (
                  <button
                    onClick={() => navigate('/chat')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all"
                  >
                    <PlusCircle size={16} />
                    <span>노래 생성하기</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/board/my')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">마이페이지</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>

                <div className="hidden sm:block text-right ml-2">
                  <div className="text-sm text-gray-400">안녕하세요</div>
                  <div className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {userName}님!
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/20 hover:shadow-lg transition-all"
                >
                  <LogIn size={16} />
                  <span>로그인</span>
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors"
                >
                  <UserPlus size={16} />
                  <span className="hidden sm:inline">회원가입</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
