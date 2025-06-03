// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Chat from './pages/Chat';
import Music from './pages/Music';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import BoardEdit from './pages/BoardEdit';
import BoardWrite from './pages/BoardWrite';
import MyPage from './pages/MyPage';
import OAuthSuccess from './pages/OAuthSuccess';
import UploadFinish from './pages/UploadFinish';

import axios from 'axios';

// 앱 시작 시 한 번만 설정
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  return (
    <Routes>
      {/* 공통 레이아웃 적용 페이지 */}
      <Route element={<Layout />}>
        <Route path="/" element={<BoardList />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/board/edit/:id" element={<BoardEdit />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/my" element={<MyPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/music" element={<Music />} />
        <Route path="/upload/finish" element={<UploadFinish />} />
      </Route>

      {/* 로그인/회원가입 등 단독 페이지 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth2/success" element={<OAuthSuccess />} />
    </Routes>
  );
}

export default App;
