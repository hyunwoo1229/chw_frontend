import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/board');
        setBoards(response.data);
      } catch (error) {
        console.error('게시글 목록 조회 실패:', error);
        alert('게시글 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const handleClick = (id) => {
    navigate(`/board/${id}`);
  };

  if (loading) return <div className="text-center mt-10">불러오는 중...</div>;
  if (boards.length === 0) return <div className="text-center mt-10">게시글이 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📋 게시판</h1>
      <div className="space-y-4">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => handleClick(board.id)}
            className="border rounded p-4 shadow hover:bg-gray-50 cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{board.title}</h2>
            <p className="text-sm text-gray-500">{board.authorName} · {board.createdAt}</p>
            <div className="flex items-center gap-4 mt-2">
              <img src={board.imageUrl} alt="cover" className="w-16 h-16 object-cover rounded" />
              <audio src={board.audioUrl} controls className="flex-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardList;
