import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import IntroSection from '../components/IntroSection';

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
      <IntroSection />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
              음악 게시판
            </h1>
            <p className="text-gray-400">다양한 음악을 발견하고 공유하세요</p>
          </div>
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

                  <div onClick={(e) => e.stopPropagation()}>
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
