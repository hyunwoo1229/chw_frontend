import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardList() {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('name');
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/board');
        setBoards(response.data);
      } catch (error) {
        console.error('게시글 목록 불러오기 실패:', error);
        alert('게시글 목록을 불러오지 못했습니다.');
      }
    };

    fetchBoards();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
         
          {isLoggedIn && userName && (
            <span className="text-lg font-semibold text-gray-700">
            안녕하세요, {userName}님!
          </span>
          )}
        </div>
        <div className="space-x-3">
          <button
            onClick={() => navigate('/chat')}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            노래 생성
          </button>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              로그아웃
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {boards.map((board) => (
          <Link
            to={`/board/${board.id}`}
            key={board.id}
            className="border rounded shadow p-4 hover:shadow-md transition"
          >
            <img
              src={board.imageUrl}
              alt="cover"
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p className="font-bold text-lg">{board.title}</p>
            <p className="text-sm text-gray-500 mb-1">
              {board.authorName} · {board.createdAt} · 조회수 {board.views}회
            </p>
            <audio controls src={board.audioUrl} className="w-full" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BoardList;
