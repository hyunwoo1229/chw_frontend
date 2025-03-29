import React, { useState } from 'react';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reply = response.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '⚠️ 에러가 발생했어요. 다시 시도해 주세요.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🎤 작곡 도우미 GPT</h1>

      <div className="border rounded p-4 h-96 overflow-y-scroll bg-white shadow mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === 'user' ? 'text-right text-blue-600' : 'text-left text-green-700'
            }`}
          >
            <span>{msg.content}</span>
          </div>
        ))}
        {loading && <p className="text-gray-500">답변 생성 중...</p>}
      </div>

      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // 엔터 기본 제출 방지!
              handleSend();
            }
          }}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-2 border rounded-l focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default Chat;
