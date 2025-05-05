import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ loginId: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form)

      // JWT와 사용자 이름 저장
      const { token, name } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('name', name)

      // axios Authorization 헤더 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      navigate('/')
    } catch (err) {
      alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">아이디(이메일):</label>
            <input
              type="text"
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="아이디 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">비밀번호:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="비밀번호 입력"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 space-y-2">
          <button
            onClick={() =>
              window.location.href = 'http://localhost:8080/oauth2/authorization/google'
            }
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            구글로 로그인
          </button>
          <button
            onClick={() =>
              window.location.href = 'http://localhost:8080/oauth2/authorization/naver'
            }
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            네이버로 로그인
          </button>
          <button
            onClick={() =>
              window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'
            }
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded"
          >
            카카오로 로그인
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
