import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다');
      navigate('/login');
    }
  }, [navigate]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/chat',
        { messages: newMessages },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const reply = response.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ 오류가 발생했습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/chat/summarize',
        { messages },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const taskId = response.data;
      console.log("🎯 생성된 taskId:", taskId);
  
      if (!taskId) throw new Error("taskId가 없음");
  
      navigate(`/music?taskId=${taskId}`);
    } catch (error) {
      console.error("❌ 요청 실패:", error.response?.data || error.message);
      alert('노래 생성 중 오류가 발생했습니다.'); 
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🎤 작곡 도우미 GPT</h1>

      <div className="border rounded p-4 h-96 overflow-y-scroll bg-white shadow mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.role === 'user' ? 'text-right text-blue-600' : 'text-left text-green-700'}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-500">답변 생성 중...</p>}
      </div>

      <div className="flex mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-2 border rounded-l focus:outline-none"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600">
          전송
        </button>
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {generating ? '🎵 생성 요청 중...' : '🎵 노래 만들기'}
      </button>
    </div>
  );
}

export default Chat;
