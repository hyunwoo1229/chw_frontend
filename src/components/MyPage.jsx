import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="text-center mt-10">⏳ 게시글을 불러오는 중...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">📁 마이페이지</h2>
        {name && <span className="text-xl font-semibold text-blue-600">안녕하세요 {name}님!</span>}
      </div>

      {boards.length === 0 ? (
        <p className="text-center text-gray-600">작성한 게시글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => navigate(`/board/${board.id}`)}
              className="cursor-pointer border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition duration-200"
            >
              <img src={board.imageUrl} alt="cover" className="w-full h-48 object-cover mb-3" />
              <h3 className="text-lg font-bold mb-1">{board.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {board.authorName} · {board.createdAt} · 조회수 {board.views}회
              </p>
              <audio controls src={board.audioUrl} className="w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPage;
