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

      // 이후 axios 요청에 Authorization 헤더 자동 설정
      import("axios").then(({ default: axios }) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        navigate("/"); // 홈으로 이동
      });
    } else {
      alert("로그인 중 문제가 발생했습니다.");
      navigate("/");
    }
  }, [navigate]);

  return <p style={{ textAlign: "center" }}>로그인 처리 중입니다...</p>;
};

export default OAuthSuccess;
