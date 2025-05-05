import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    loginId: '',
    password: '',
    name: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8080/api/auth/register', form)
      alert('회원가입 성공')
      navigate('/login')
    } catch (err) {
      alert('회원가입 실패')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">회원가입</h2>
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
          <div>
            <label className="block text-sm font-medium">이름:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="이름 입력"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
          >
            회원가입
          </button>
        </form>

        <div className="mt-6 space-y-2">
          <button
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            구글로 가입
          </button>
          <button
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/naver'}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            네이버로 가입
          </button>
          <button
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded"
          >
            카카오로 가입
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
