import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        loginId,
        password,
        name,
      });

      // 성공 메시지 (백엔드에서 내려준 message 사용)
      if (response.status === 201) {
        setSuccessMsg(response.data.message || '회원가입 성공! 로그인 페이지로 이동합니다.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error(error);

      // 백엔드에서 내려준 에러 메시지 사용
      const serverMsg = error.response?.data?.message;
      const defaultMsg = '회원가입 실패: 알 수 없는 에러가 발생했습니다.';
      setErrorMsg(serverMsg || defaultMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">아이디(이메일):</label>
            <input
              type="text"
              placeholder="아이디 입력"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">비밀번호:</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">이름:</label>
            <input
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-300"
            />
          </div>
          {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
          {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
