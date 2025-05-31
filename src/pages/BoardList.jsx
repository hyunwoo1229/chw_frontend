import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Music,
  LogOut,
  User,
  LogIn,
  UserPlus,
  PlusCircle,
} from 'lucide-react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/board');
        setBoards(response.data);
      } catch (error) {
        console.error('게시글 목록 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUserName(storedName);
    }

    fetchBoards();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md shadow-lg px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Music size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold">MusicBoard</span>
          </div>

          <div className="flex items-center gap-3">
            {userName ? (
              <>
                <div className="hidden sm:block text-right">
                  <div className="text-sm text-gray-400">안녕하세요</div>
                  <div className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {userName}님!
                  </div>
                </div>
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

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
              음악 게시판
            </h1>
            <p className="text-gray-400">다양한 음악을 발견하고 공유하세요</p>
          </div>

          <button
            onClick={() => navigate('/chat')}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            <PlusCircle size={18} />
            <span>노래 생성하기</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="border-4 border-gray-700 border-t-purple-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {boards.map((board) => (
              <div
                key={board.id}
                className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/30 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                onClick={() => navigate(`/board/${board.id}`)}
              >
                <div className="relative overflow-hidden aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10"></div>
                  <img
                    src={board.imageUrl}
                    alt="Album cover"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h2 className="text-lg font-bold text-white truncate mb-1">
                      {board.title}
                    </h2>
                    <p className="text-sm text-gray-300 opacity-90">
                      {board.authorName}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-400 space-x-3 mb-4">
                    <span>{board.createdAt}</span>
                    <span>•</span>
                    <span>조회수 {board.views}회</span>
                  </div>

                  <div
  onClick={(e) => {
    e.stopPropagation(); // 클릭 이벤트 버블링 차단
  }}
>
  <AudioPlayer
    src={board.audioUrl}
    showJumpControls={false}
    customAdditionalControls={[]}
    layout="horizontal"
    className="w-full rounded-lg bg-gray-900 text-white accent-purple-500"
  />
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default BoardList;
