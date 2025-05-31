import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Pencil, Trash2 } from 'lucide-react';
import { Upload } from 'lucide-react';

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
        `http://localhost:8080/api/youtube/${id}`,
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
        sessionStorage.setItem('pendingUploadBoardId', id);
        window.location.href = `http://localhost:8080/api/youtube/connect?token=${token}`;
      } else {
        alert(`❌ 업로드 실패: ${message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        ⏳ 게시글을 불러오는 중...
      </div>
    );
  }

  if (!board) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
              {board.title}
            </h2>
            <p className="text-gray-400 text-sm">
              {board.authorName} · {board.createdAt} · 조회수 {board.views}회
            </p>
          </div>

          {board.author === true && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 transition"
                >
                   <Pencil size={16} />
              
                수정
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:brightness-110 transition"
              >
                <Trash2 size={16} />
                삭제
              </button>
            </div>
          )}
        </div>

        <div className="w-1/2 aspect-video mx-auto mb-6 overflow-hidden rounded-xl shadow-lg">
  <img
    src={board.imageUrl}
    alt="cover"
    className="w-full h-full object-cover"
  />
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

        <p className="text-lg text-white/90 whitespace-pre-line">{board.content || '내용이 없습니다.'}</p>

        {board.author === true && (
          <div className="text-right">
            <button
              onClick={handleYoutubeUpload}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-5 py-3 mt-4 font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={18} />
              {uploading ? 'YouTube 업로드 중...' : 'YouTube 업로드'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardDetail;
