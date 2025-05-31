import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showNewMessageBadge, setShowNewMessageBadge] = useState(false);
  const navigate = useNavigate();

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const autoScrollRef = useRef(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (autoScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowNewMessageBadge(true);
    }
  }, [messages]);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
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
      if (!taskId) throw new Error('taskId 없음');
      navigate(`/music?taskId=${taskId}`);
    } catch (error) {
      console.error('❌ 요청 실패:', error.response?.data || error.message);
      alert('노래 생성 중 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element) return;

    const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;

    autoScrollRef.current = isAtBottom;
    if (isAtBottom) {
      setShowNewMessageBadge(false);
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    autoScrollRef.current = true;
    setShowNewMessageBadge(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1c1c2b] text-white px-0 py-10">
      {/* 설명 */}
      <div className="max-w-full px-10 text-left mb-10">
        <h2 className="text-5xl font-bold text-white mb-2">AI와 함께 노래를 만들어봐요!</h2>
        <p className="text-[16px] text-gray-300 leading-relaxed mt-[60px]">
          아직 떠오르는 주제나 가사가 없어도 괜찮아요.<br />
          AI가 대화를 통해 멋진 노래를 만들어 줄 거예요.<br />
          생각나는 감정이나 이야기를 자유롭게 입력해보세요.<br />
          <span className="block mt-4 text-white font-medium">
            추가하거나 수정할 내용이 없다면 아래 ‘노래 만들기’ 버튼을 눌러주세요!
          </span>
        </p>
      </div>

      {/* 채팅 */}
      <div className="grid grid-cols-12 px-10 " >
        <div className="col-span-12 flex flex-col items-end space-y-4 self-start mt-[-250px]">
          {/* 대화창 */}
          <div
            className="h-[600px] w-[65%] ml-auto mt-0 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 overflow-y-scroll shadow-lg"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap text-sm ${
                    msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-sm text-gray-400">답변 생성 중...</p>}
            <div ref={bottomRef} />
          </div>

          {/* 새 메시지 도착 안내 */}
          {showNewMessageBadge && (
            <button
              onClick={scrollToBottom}
              className="text-sm text-purple-300 underline hover:text-purple-100 transition"
            >
              🔔 새로운 메시지가 도착했습니다
            </button>
          )}

          {/* 입력창 */}
          <div className="w-[65%] flex rounded-lg overflow-hidden shadow ml-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-white hover:brightness-110 transition"
            >
              전송
            </button>
          </div>

          {/* 노래 만들기 버튼 */}
          <div className="w-[60%] text-right ml-auto">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-600 to-red-500 text-white font-semibold rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {generating ? '🎵 생성 요청 중...' : '🎵 노래 만들기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
