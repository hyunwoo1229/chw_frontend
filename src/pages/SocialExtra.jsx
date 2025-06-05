// src/pages/SocialExtra.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const countries = ["대한민국", "미국", "일본", "영국", "프랑스", "독일", "캐나다", "중국", "호주", "인도"];
const genders = ["남성", "여성"];
const ages = Array.from({ length: 101 }, (_, i) => i);

const SocialExtra = () => {
  const [form, setForm] = useState({ age: '', gender: '', country: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 쿼리에서 token과 name을 추출해서 localStorage에 저장하고,
  //    axios의 기본 헤더에도 Authorization 설정 추가  (수정된 부분)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = decodeURIComponent(params.get('name') || '');  // 추가: name 추출

    if (token) {
      // 수정: localStorage에 token 저장
      localStorage.setItem('token', token);

      // 수정: axios 기본 헤더에 Authorization 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    if (name) {
      // 추가: localStorage에 name 저장
      localStorage.setItem('name', name);
    }
  }, [location.search]); // location.search가 변경될 때마다 실행

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 handleSubmit 실행됨");
    const token = localStorage.getItem('token'); // (기존 코드)
    try {
      await axios.post('http://localhost:8080/api/member/update-extra', form, {
        headers: { Authorization: `Bearer ${token}` }, // 기존: POST 요청 시 Header에 토큰 전달
      });
      alert('정보 입력 완료!');
      navigate('/'); // 추가정보 입력 완료 후 홈으로 이동
    } catch (err) {
      console.error("❌ axios error", err);
      console.log("📦 err.response", err.response);
      alert('정보 저장 실패: ' + (err.response?.data?.message || err.message || '서버 오류'));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="bg-gray-800/90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
          추가 정보 입력
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">나이</label>
            <select
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
              required
            >
              <option value="">나이 선택</option>
              {ages.map(age => (
                <option key={age} value={age}>{age}세</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">성별</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
              required
            >
              <option value="">성별 선택</option>
              {genders.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">국가</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
              required
            >
              <option value="">국가 선택</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded hover:brightness-110 transition"
          >
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SocialExtra;
