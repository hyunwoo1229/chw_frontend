import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        loginId,
        password,
      });

      // 성공 시 토큰 저장 및 페이지 이동
      localStorage.setItem('token', response.data.message); // SuccessResponse 안의 token은 message 필드에 담겨 있음
      navigate('/chat');
    } catch (error) {
      console.error(error);

      // 백엔드에서 보낸 메시지를 그대로 표시
      const serverMsg = error.response?.data?.message;
      const defaultMsg = '로그인 실패: 알 수 없는 에러가 발생했습니다.';
      setErrorMsg(serverMsg || defaultMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">아이디(이메일):</label>
            <input
              type="text"
              placeholder="아이디 입력"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">비밀번호:</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            로그인
          </button>
        </form>
        <p className="mt-4 text-center">
          계정이 없으신가요?{' '}
          <button onClick={handleSignupClick} className="text-blue-500 hover:underline">
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
