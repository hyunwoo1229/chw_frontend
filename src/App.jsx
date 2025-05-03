import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Chat from './components/Chat';
import Music from './components/Music';
import Login from './components/Login';
import Register from './components/Register';
import BoardList from './components/BoardList';
import BoardDetail from './components/BoardDetail';
import BoardEdit from './components/BoardEdit';
import BoardWrite from './components/BoardWrite';

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
      </Routes>
    
  );
}

export default App;