import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/board/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoard(response.data);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글을 불러오지 못했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id, token, navigate]);

  const handleEdit = () => {
    navigate(`/board/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/board/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('게시글이 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleYoutubeUpload = async () => {
    if (!window.confirm('이 음악을 YouTube에 업로드하시겠습니까?')) return;
  
    try {
      setUploading(true);
      const res = await axios.post(
        `http://localhost:8080/api/board/${id}/youtube`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`✅ YouTube 업로드 성공!\n${res.data.data}`);
      window.open(res.data.data, '_blank');
    } catch (e) {
      const status = e.response?.status;
      const message = e.response?.data?.message || e.message;
  
      if (status === 401 || status === 403) {
        sessionStorage.setItem("pendingUploadBoardId", id);
        window.location.href = `http://localhost:8080/api/connect/youtube?token=${token}`;
      } else {
        alert(`❌ 업로드 실패: ${message}`);
      }
    } finally {
      setUploading(false);
    }
  };
  
  

  if (loading) return <div className="text-center mt-10">⏳ 게시글을 불러오는 중...</div>;
  if (!board) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">{board.title}</h2>
          <p className="text-gray-500">
            {board.authorName} · {board.createdAt} · 조회수 {board.views}회
          </p>
        </div>

        {board.author === true && (
          <div className="space-x-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <img src={board.imageUrl} alt="cover" className="w-full h-64 object-cover mb-4" />
      <audio controls src={board.audioUrl} className="w-full mb-6" />
      <p className="text-lg mb-4">{board.content || '내용이 없습니다.'}</p>

      {board.author === true && (
        <div className="text-right">
          <button
            onClick={handleYoutubeUpload}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {uploading ? 'YouTube 업로드 중...' : 'YouTube 업로드'}
          </button>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;
