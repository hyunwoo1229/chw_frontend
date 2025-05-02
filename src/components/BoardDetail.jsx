import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardDetail() {
  const { id } = useParams(); // /board/:id
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/board/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBoard(response.data);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id, token]);

  const handleDelete = async () => {
    const confirm = window.confirm('정말 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8080/api/board/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('삭제 완료');
      navigate('/board'); // 게시판 목록으로 이동
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 권한이 없거나 오류가 발생했습니다.');
    }
  };

  const handleEdit = () => {
    navigate(`/board/edit/${id}`); // 수정 페이지로 이동
  };

  if (loading) return <div className="text-center mt-10 text-lg">불러오는 중...</div>;
  if (!board) return <div className="text-center mt-10 text-lg">게시글이 존재하지 않습니다.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{board.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{board.authorName} · {board.createdAt}</p>
      <p className="mb-6 whitespace-pre-line">{board.content}</p>

      <img src={board.imageUrl} alt="cover" className="w-full h-60 object-cover rounded mb-4" />
      <audio controls src={board.audioUrl} className="w-full mb-6" />

      {board.author && (
        <div className="flex gap-4">
          <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">수정</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">삭제</button>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;
