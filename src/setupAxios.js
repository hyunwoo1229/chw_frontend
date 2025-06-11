// src/setupAxios.js
import axios from 'axios';

// 1) baseURL 설정
axios.defaults.baseURL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : '';

// 2) 쿠키 전송
axios.defaults.withCredentials = true;

// 3) 요청 인터셉터: URL 정리 + accessToken 삽입
axios.interceptors.request.use(config => {
  let url = config.url || '';

  // (A) 개발환경에서 백엔드 절대경로가 들어오면 호스트 제거
  if (import.meta.env.DEV && /^https?:\/\/[^/]+/.test(url)) {
    url = url.replace(/^https?:\/\/[^/]+/, '');
  }

  // (B) 앞뒤 슬래시 정리
  url = url.replace(/^\/+|\/+$/g, '');

  // (C) api/ 로 시작하지 않으면 붙이기
  if (!url.startsWith('api/')) {
    url = `api/${url}`;
  }

  config.url = `/${url}`;

  // ✅ accessToken이 있으면 Authorization 헤더에 추가
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 4) 응답 인터셉터: 401 → refresh → 재시도
axios.interceptors.response.use(
  res => res,
  async err => {
    
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      try {
        const { data } = await axios.post('/auth/refresh', null, {
          withCredentials: true
        });

        // ✅ 새 accessToken 저장 및 재시도 요청에 삽입
        localStorage.setItem('accessToken', data.accessToken);
        orig.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(orig);
      } catch {
        // 리프레시 실패 시 로그인 페이지로 이동
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default axios;
