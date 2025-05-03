// src/components/BoardList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/board');
        setBoards(response.data);
      } catch (error) {
        console.error('게시글 목록 불러오기 실패:', error);
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎵 게시판</h1>
        <div className="flex items-center gap-3">
          {userName && (
            <>
              <span className="text-lg font-semibold text-gray-700">
                안녕하세요 <span className="text-blue-600">{userName}</span>님!
              </span>
              <button
                onClick={() => navigate('/board/my')}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                마이페이지
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                로그아웃
              </button>
            </>
          )}
          {!userName && (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                회원가입
              </button>
            </>
          )}
          <button
            onClick={() => navigate('/chat')}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            노래 생성
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            className="border p-4 rounded shadow hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <img src={board.imageUrl} alt="cover" className="w-full h-40 object-cover rounded mb-2" />
            <h2 className="text-xl font-semibold">{board.title}</h2>
            <p className="text-sm text-gray-500">
              {board.authorName} · {board.createdAt} · 조회수 {board.views}회
            </p>
            <audio controls src={board.audioUrl} className="w-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardList;
