import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadFinish() {
  const navigate = useNavigate();

  useEffect(() => {
    const boardId = sessionStorage.getItem("pendingUploadBoardId");
    const token = localStorage.getItem("token");


    if (!token || !boardId) {
      alert("업로드할 게시글 정보가 없습니다.");
      navigate("/"); // ✅ 홈으로 자동 이동
      return;
    }

    axios.post(`http://localhost:8080/api/board/${boardId}/youtube`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      alert("✅ YouTube 업로드 성공!");
      window.open(res.data.data, "_blank");
      sessionStorage.removeItem("pendingUploadBoardId");
      navigate("/"); // ✅ 업로드 성공 후 메인으로
    })
    .catch(err => {
      alert("❌ 업로드 실패: " + (err.response?.data?.message || err.message));
      navigate("/"); // ✅ 실패해도 메인으로 복귀
    });
  }, [navigate]);

  return (
    <div className="text-center mt-32 text-xl">
      ⏳ YouTube 업로드를 처리 중입니다...
    </div>
  );
}

export default UploadFinish;
