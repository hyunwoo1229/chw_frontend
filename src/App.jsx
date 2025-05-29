import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Chat from './pages/Chat';
import Music from './pages/Music';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import BoardEdit from './pages/BoardEdit';
import BoardWrite from './pages/BoardWrite';
import MyPage from './pages/MyPage';
import OAuthSuccess from './pages/OAuthSuccess'
import UploadFinish from './pages/UploadFinish';

// App.jsx 또는 index.jsx
import axios from 'axios';

// 앱 시작 시 한 번만 설정
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  return (
   
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/music" element={<Music />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<BoardList />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/board/edit/:id" element={<BoardEdit />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/my" element={<MyPage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/upload/finish" element={<UploadFinish />} />
      </Routes>
    
  );
}

export default App;