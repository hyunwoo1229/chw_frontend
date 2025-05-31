import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = decodeURIComponent(params.get("name") || "");

    if (token && name) {
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);

      import("axios").then(({ default: axios }) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        navigate("/");
      });
    } else {
      alert("로그인 중 문제가 발생했습니다.");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid mb-6" />
      <h2 className="text-2xl font-semibold mb-2">로그인 처리 중입니다...</h2>
      <p className="text-sm text-gray-400">잠시만 기다려 주세요 🔄</p>
    </div>
  );
};

export default OAuthSuccess;
