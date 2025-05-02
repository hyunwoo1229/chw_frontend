import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/board/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const board = response.data;
        if (!board.author) {
          alert('작성자만 수정할 수 있습니다.');
          navigate(-1);
          return;
        }

        setTitle(board.title);
        setContent(board.content);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글 정보를 불러올 수 없습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/board/${id}`, {
        title,
        content,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('수정 완료');
      navigate(`/board/${id}`);
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정 권한이 없거나 오류가 발생했습니다.');
    }
  };

  if (loading) return <div className="text-center mt-10">불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full border px-3 py-2 rounded resize-none"
            required
          />
        </div>
        <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          수정하기
        </button>
      </form>
    </div>
  );
}

export default BoardEdit;
