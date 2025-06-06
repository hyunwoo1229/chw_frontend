import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CategoryCarousel from '../components/CategoryCarousel';

function BoardList() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  // 조회순, 최신순, 그리고 같은 나이대/같은 국가/같은 성별 게시물을 담을 상태 추가
  const [popularBoards, setPopularBoards] = useState([]);
  const [recentBoards, setRecentBoards] = useState([]);
  const [sameAgeBoards, setSameAgeBoards] = useState([]);
  const [sameCountryBoards, setSameCountryBoards] = useState([]);
  const [sameGenderBoards, setSameGenderBoards] = useState([]);

  useEffect(() => {
    // 1) localStorage에서 사용자 이름만 가져오기
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUserName(storedName);
    }

    // 2) 백엔드 API 호출: /api/board 한 번만 (다섯 개 카테고리 데이터를 함께 받아옴)
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('token');
        const axiosConfig = {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        };

        const response = await axios.get(
          'http://localhost:8080/api/board',
          axiosConfig
        );

        // 서버가 응답해 주는 JSON 형태는 예를 들어:
        // {
        //   popularBoards: [...],
        //   recentBoards: [...],
        //   sameAgeBoards: [...],
        //   sameCountryBoards: [...],
        //   sameGenderBoards: [...]
        // }

        const data = response.data;

        // 3) 받은 데이터들 상태에 세팅
        setPopularBoards(data.popularBoards || []);
        setRecentBoards(data.recentBoards || []);
        setSameAgeBoards(data.sameAgeBoards || []);
        setSameCountryBoards(data.sameCountryBoards || []);
        setSameGenderBoards(data.sameGenderBoards || []);
      } catch (error) {
        console.error('카테고리별 게시물 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* ── 본문 ── */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="border-4 border-gray-700 border-t-purple-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <main className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-6 pb-8">
          {/* 1) 조회순 게시물 */}
          {popularBoards.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
                조회순 게시물
              </h2>
              <CategoryCarousel
                title=""
                items={popularBoards}
                basePath="/board"
              />
            </>
          )}

          {/* 2) 최신순 게시물 */}
          {recentBoards.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mt-12 mb-4">
                최신순 게시물
              </h2>
              <CategoryCarousel
                title=""
                items={recentBoards}
                basePath="/board"
              />
            </>
          )}

          {/* 같은 나이대/같은 국가/같은 성별은 로그인된 사용자만 */}
          {userName && (
            <>
              {/* 3) 같은 나이대 게시물 */}
              {sameAgeBoards.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mt-12 mb-4">
                    같은 나이대 게시물
                  </h2>
                  <CategoryCarousel
                    title=""
                    items={sameAgeBoards}
                    basePath="/board"
                  />
                </>
              )}

              {/* 4) 같은 국가 게시물 */}
              {sameCountryBoards.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mt-12 mb-4">
                    같은 국가 게시물
                  </h2>
                  <CategoryCarousel
                    title=""
                    items={sameCountryBoards}
                    basePath="/board"
                  />
                </>
              )}

              {/* 5) 같은 성별 게시물 */}
              {sameGenderBoards.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mt-12 mb-4">
                    같은 성별 게시물
                  </h2>
                  <CategoryCarousel
                    title=""
                    items={sameGenderBoards}
                    basePath="/board"
                  />
                </>
              )}
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default BoardList;
