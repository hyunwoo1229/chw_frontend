import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function Music() {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
  console.log('taskId:', taskId); // 🧪 이 로그가 null이면 원인 확정!

  useEffect(() => {
    if (!taskId) return;
    let intervalId;

    const checkMusicReady = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/suno/music-list?taskId=${taskId}`);
        const completeList = response.data.filter(m => m.audioUrl);

        if (completeList.length >= 2) {
          clearInterval(intervalId);
          setMusicList(completeList);
          setChecking(false);
          setLoading(false);
        } else {
          console.log('🎵 아직 곡이 완성되지 않았습니다...');
        }
      } catch (error) {
        console.error('음악 조회 중 오류 발생:', error);
      }
    };

    checkMusicReady();
    intervalId = setInterval(checkMusicReady, 5000);

    return () => clearInterval(intervalId);
  }, [taskId]);

  const handleChoose = async (music) => {
    try {
      await axios.post('http://localhost:8080/api/suno/choose', music);
      alert('노래 선택 완료!');
      window.location.href = '/chat';
    } catch (error) {
      alert('선택 실패');
    }
  };

  if (!taskId) return <div className="text-center mt-20 text-xl">❌ 유효하지 않은 요청입니다.</div>;
  if (checking) return <div className="text-center mt-20 text-xl">🎵 노래 만드는 중...</div>;
  if (loading || musicList.length < 2) return <div className="text-center mt-20 text-xl">❌ 노래가 준비되지 않았습니다.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">🎶 생성된 노래를 골라주세요!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {musicList.map((music, idx) => (
          <div key={idx} className="border p-4 rounded shadow text-center">
            <img src={music.imageUrl} alt="cover" className="w-48 h-48 object-cover mx-auto mb-4 rounded" />
            <audio controls src={music.audioUrl} className="w-full mb-2" />
            <p className="font-semibold">{music.title}</p>
            <button
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleChoose(music)}
            >
              이 곡 선택
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Music;
