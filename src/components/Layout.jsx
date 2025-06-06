import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Music,
  LogOut,
  User,
  LogIn,
  UserPlus,
  PlusCircle,
  Search,
} from 'lucide-react';
import IntroSection from './IntroSection';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인된 사용자의 이름을 상태로 관리
  const [userName, setUserName] = useState(() => localStorage.getItem('name'));

  // 경로(pathname) 또는 쿼리(location.search)가 바뀔 때마다 userName 갱신
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    setUserName(storedName);
  }, [location.pathname, location.search]);

  // 헤더 검색창의 입력값을 상태로 관리
  const [headerSearch, setHeaderSearch] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('query') || '';
    setHeaderSearch(q);
  }, [location.search]);

  // 모든 페이지 진입 시 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setUserName(null);
    navigate('/');
    window.location.reload();
  };

  // 검색 폼 제출 시 호출
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = headerSearch.trim();
    if (trimmed) {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/search');
    }
  };

  const pathname = location.pathname;
  const hideSongButton = ['/chat', '/music', '/board/write'].some((path) =>
    pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md shadow-lg">
        <div className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center gap-4 py-3">
          {/* 로고 클릭 시 홈으로 이동 */}
          <div
            className="flex items-center gap-2 cursor-pointer ml-2"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Music size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold">MusicBoard</span>
          </div>

          {/* 헤더 검색창 */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center ml-4 flex-1 max-w-lg"
          >
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="게시물 제목 검색"
              className="flex-grow bg-gray-700 border border-gray-600 text-white px-4 py-2.5 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-gray-700 border-t border-b border-r border-gray-600 px-4 py-3 rounded-r-lg hover:bg-gray-600 transition-colors"
              title="검색"
            >
              <Search size={20} className="text-gray-300 hover:text-white" />
            </button>
          </form>

          {/* 우측 네비게이션 (로그인 / 마이페이지 / 로그아웃 등) */}
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

      {/* ── 로그인하지 않은 상태에서만 IntroSection 보이기 ── */}
      {location.pathname === '/' && !userName && <IntroSection />}

      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
