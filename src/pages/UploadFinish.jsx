import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadFinish() {
  const navigate = useNavigate();

  useEffect(() => {
    // useEffect 내에서 비동기 함수를 선언하고 바로 호출하는 패턴 사용
    const retryUpload = async () => {
      const boardId = sessionStorage.getItem("pendingUploadBoardId");
      // 'token' -> 'accessToken'으로 키 이름 수정
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken || !boardId) {
        alert("업로드할 게시글 정보가 없거나 로그인 정보가 없습니다.");
        navigate("/");
        return;
      }

      try {
        // headers 옵션 제거 및 async/await 구문으로 변경
        const res = await axios.post(`http://localhost:8080/api/youtube/${boardId}`, null);
        
        alert("✅ YouTube 업로드 성공!");
        window.open(res.data.data, "_blank");
        sessionStorage.removeItem("pendingUploadBoardId");
        navigate("/");
      } catch (err) {
        alert("❌ 업로드 실패: " + (err.response?.data?.message || err.message));
        navigate("/");
      }
    };

    retryUpload();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid mb-6" />
      <h2 className="text-2xl font-semibold mb-2">YouTube 업로드 중입니다...</h2>
      <p className="text-sm text-gray-400">잠시만 기다려 주세요 🎵</p>
    </div>
  );
}

export default UploadFinish;