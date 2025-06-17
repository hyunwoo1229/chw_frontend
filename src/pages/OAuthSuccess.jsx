import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate는 이제 사용되지 않습니다.

const OAuthSuccess = () => {
  // navigate는 더 이상 필요 없습니다.
  // const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const name = decodeURIComponent(params.get("name") || "");

    if (accessToken && refreshToken && name) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("name", name);

      // - - - - 수정할 부분 - - - - -
      // navigate("/"); // 이 줄을 아래 코드로 변경합니다.
      window.location.replace("/"); // 메인 페이지로 이동하며 새로고침하고, 뒤로가기 기록을 남기지 않습니다.
      // - - - - - - - - - - - - - - -

    } else {
      alert("로그인 중 문제가 발생했습니다. 토큰 정보가 없습니다.");
      // 여기도 동일하게 변경합니다.
      window.location.replace("/");
    }
  // 의존성 배열에서 navigate 제거
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid mb-6" />
      <h2 className="text-2xl font-semibold mb-2">로그인 처리 중입니다...</h2>
      <p className="text-sm text-gray-400">잠시만 기다려 주세요 🔄</p>
    </div>
  );
};

export default OAuthSuccess;