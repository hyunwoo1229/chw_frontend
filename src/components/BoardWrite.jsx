import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardWrite() {
  const { state } = useLocation();
  const music = state?.music;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [title, setTitle] = useState(music?.title || '');
  const [content, setContent] = useState('');

  // ✅ music이 없으면 뒤로 보내거나 안내
  useEffect(() => {
    if (!music) {
      alert('유효하지 않은 접근입니다. 음악 정보가 없습니다.');
      navigate('/chat');
    }
  }, [music, navigate]);

  if (!music) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8080/api/board',
        {
          title,
          content,
          musicId: music.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('게시글 등록 완료!');
      navigate('/board');
    } catch (error) {
      console.error('등록 실패:', error);
      alert('게시글 등록 중 오류 발생');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">게시글 작성</h1>

      {/* 음악 미리보기 */}
      <div className="mb-6 text-center">
        <img src={music.imageUrl} alt="cover" className="w-48 h-48 object-cover mx-auto rounded mb-4" />
        <audio controls src={music.audioUrl} className="w-full" />
      </div>

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
            placeholder="곡에 대한 설명이나 하고 싶은 말을 적어보세요!"
            required
          />
        </div>
        <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          등록하기
        </button>
      </form>
    </div>
  );
}

export default BoardWrite;
