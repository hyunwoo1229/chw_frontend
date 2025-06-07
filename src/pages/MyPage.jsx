// src/pages/MyPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function MyPage() {
  const [boards, setBoards] = useState([]);         // 원본 게시글 배열
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('recent'); // 'recent' 또는 'views'
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/board/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBoards(response.data);
      } catch (error) {
        console.error('❌ 마이페이지 게시글 조회 실패:', error);
        alert('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [token, navigate]);

  // boards 배열을 sortType에 따라 정렬한 새로운 배열을 반환
  const sortedBoards = React.useMemo(() => {
    if (!boards) return [];

    // 배열 복사
    const copy = [...boards];

    if (sortType === 'views') {
      // 조회수 내림차순 정렬
      copy.sort((a, b) => b.views - a.views);
    } else {
      // recent: createdAt을 기준으로 내림차순 정렬
      // 서버에서 받은 createdAt이 "YYYY-MM-DD HH:mm" 같은 문자열 형태라 가정
      copy.sort((a, b) => {
        const dateA = new Date(a.createdAt.replace(' ', 'T'));
        const dateB = new Date(b.createdAt.replace(' ', 'T'));
        return dateB - dateA;
      });
    }

    return copy;
  }, [boards, sortType]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        ⏳ 게시글을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* ── 헤더 ── */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            📁 마이페이지
          </h2>

        </div>

        {/* ── 정렬 버튼들 ── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSortType('views')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              sortType === 'views'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            조회순 정렬
          </button>
          <button
            onClick={() => setSortType('recent')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              sortType === 'recent'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            최신순 정렬
          </button>
        </div>

        {/* ── 게시글 목록 ── */}
        {sortedBoards.length === 0 ? (
          <p className="text-center text-gray-400">작성한 게시글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBoards.map((board) => (
              <div
                key={board.id}
                onClick={() => navigate(`/board/${board.id}`)}
                className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/30 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
              >
                {/* ── 썸네일 영역 ── */}
                <div className="relative overflow-hidden aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10"></div>
                  <img
                    src={board.imageUrl}
                    alt="cover"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="text-lg font-bold text-white truncate mb-1">
                      {board.title}
                    </h3>
                    <p className="text-sm text-gray-300">{board.authorName}</p>
                  </div>
                </div>

                {/* ── 정보 영역 ── */}
                <div className="p-4">
                  <p className="text-sm text-gray-400 mb-3">
                    {board.createdAt} • 조회수 {board.views}회
                  </p>
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
      </div>
    </div>
  );
}

export default MyPage;
