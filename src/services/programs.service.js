import http from './http.js';

// 더미 데이터 (API가 없을 때 사용)
const dummyPrograms = [
  {
    id: 1,
    title: '웹 개발자 취업 준비 과정',
    description: '프론트엔드부터 백엔드까지 전반적인 웹 개발 기술을 학습하고 취업을 준비하는 과정입니다.',
    category: 'IT/개발',
    startDate: '2024-02-15',
    image: 'https://via.placeholder.com/400x200/3b82f6/ffffff?text=Web+Development'
  },
  {
    id: 2,
    title: '데이터 사이언스 입문 과정',
    description: '파이썬을 활용한 데이터 분석과 머신러닝의 기초를 배우는 과정입니다.',
    category: '데이터/분석',
    startDate: '2024-02-20',
    image: 'https://via.placeholder.com/400x200/10b981/ffffff?text=Data+Science'
  },
  {
    id: 3,
    title: '디자인 포트폴리오 워크샵',
    description: 'UI/UX 디자인 포트폴리오를 완성하고 취업에 필요한 실무 역량을 기르는 워크샵입니다.',
    category: '디자인',
    startDate: '2024-02-25',
    image: 'https://via.placeholder.com/400x200/f59e0b/ffffff?text=Design'
  }
];

export const programsService = {
  // 다가오는 프로그램 3개 조회
  async getUpcoming() {
    try {
      const response = await http.get('/programs/upcoming');
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패, 더미 데이터 사용:', error.message);
      // API가 없을 때 더미 데이터 반환
      return dummyPrograms;
    }
  },

  // 개인화 추천 프로그램 3개 조회
  async getRecommendations() {
    try {
      const response = await http.get('/programs/recommendations');
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패, 더미 데이터 사용:', error.message);
      // API가 없을 때 더미 데이터 반환
      return dummyPrograms.slice(0, 2); // 추천은 2개만
    }
  },

  // 프로그램 목록/검색
  async getPrograms(params = {}) {
    const {
      q, category, region, status, page = 1, pageSize = 10, sort
    } = params;
    
    const queryParams = {};
    if (q) queryParams.q = q;
    if (category) queryParams.category = category;
    if (region) queryParams.region = region;
    if (status) queryParams.status = status;
    if (page) queryParams.page = page;
    if (pageSize) queryParams.pageSize = pageSize;
    if (sort) queryParams.sort = sort;

    try {
      const response = await http.get('/programs', { params: queryParams });
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패, 더미 데이터 사용:', error.message);
      // API가 없을 때 더미 데이터 반환
      return {
        programs: dummyPrograms,
        total: dummyPrograms.length,
        page: page,
        pageSize: pageSize
      };
    }
  },

  // 프로그램 상세 조회
  async getProgramDetail(programId) {
    try {
      const response = await http.get(`/programs/${programId}`);
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패, 더미 데이터 사용:', error.message);
      // API가 없을 때 더미 데이터 반환
      const program = dummyPrograms.find(p => p.id === parseInt(programId));
      if (program) {
        return {
          ...program,
          fullDescription: '이것은 더미 데이터입니다. 실제 API가 연결되면 실제 데이터가 표시됩니다.',
          duration: '8주',
          maxParticipants: 20,
          price: '무료',
          location: '온라인',
          instructor: '전문 강사진'
        };
      }
      throw new Error('프로그램을 찾을 수 없습니다.');
    }
  },

  // 프로그램 찜하기
  async likeProgram(programId) {
    try {
      const response = await http.post(`/programs/${programId}/like`);
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패:', error.message);
      // API가 없을 때 성공 응답 시뮬레이션
      return { success: true, message: '찜하기 완료' };
    }
  },

  // 프로그램 찜 취소
  async unlikeProgram(programId) {
    try {
      const response = await http.delete(`/programs/${programId}/like`);
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패:', error.message);
      // API가 없을 때 성공 응답 시뮬레이션
      return { success: true, message: '찜하기 취소 완료' };
    }
  },

  // 찜한 프로그램 목록 조회
  async getLikedPrograms() {
    try {
      const response = await http.get('/programs/likes');
      return response.data;
    } catch (error) {
      console.warn('찜 목록 조회 실패:', error.message);
      // API가 없을 때 빈 배열 반환
      return [];
    }
  },

  // 프로그램 신청
  async registerProgram(programId) {
    try {
      const response = await http.post(`/programs/${programId}/register`);
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패:', error.message);
      // API가 없을 때 성공 응답 시뮬레이션
      return { success: true, message: '신청 완료' };
    }
  },

  // 프로그램 신청 취소
  async unregisterProgram(programId) {
    try {
      const response = await http.delete(`/programs/${programId}/register`);
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패:', error.message);
      // API가 없을 때 성공 응답 시뮬레이션
      return { success: true, message: '신청 취소 완료' };
    }
  },

  // 프로그램 검색 (Explore 페이지용)
  async searchPrograms({
    interestCategory = 'all',
    programType = 'all',
    costType = 'all',
    startDate = '2025-08-29',
    endDate = '2025-12-31',
    sortBy = 'latest',
    page = 1,
    size = 10,
    targetAudience,
    keyword
  } = {}) {
    const params = new URLSearchParams();
    
    if (interestCategory !== 'all') params.append('interestCategory', interestCategory);
    if (programType !== 'all') params.append('programType', programType);
    if (costType !== 'all') params.append('costType', costType);
    if (targetAudience) params.append('targetAudience', targetAudience);
    if (keyword) params.append('keyword', keyword);
    
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    params.append('sortBy', sortBy);
    params.append('page', page.toString());
    params.append('size', size.toString());

    try {
      const response = await http.get(`/programs/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.warn('프로그램 검색 API 호출 실패, 더미 데이터 사용:', error.message);
      
      // 기획자 맞춤 더미 데이터 (새로운 API 응답 구조에 맞춤)
      const ALL_PROGRAMS = [
        { 
          programId: "explore-1", 
          programTitle: '서비스 기획자 직무 체험', 
          provider: '네이버 커넥트재단', 
          programTypeLabel: '체험처', 
          startDate: '2025-09-15', 
          endDate: '2025-12-15', 
          costType: 'FREE', 
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center', 
          venueRegion: '서울', 
          interestCategoryLabel: '서비스업'
        },
        { 
          programId: "explore-2", 
          programTitle: '마케팅 전략 수립 워크샵', 
          provider: '카카오 임팩트', 
          programTypeLabel: '체험처', 
          startDate: '2025-10-01', 
          endDate: '2025-11-30', 
          costType: 'PAID', 
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center', 
          venueRegion: '경기', 
          interestCategoryLabel: '서비스업'
        },
        { 
          programId: "explore-3", 
          programTitle: 'UX/UI 기획 온라인 부트캠프', 
          provider: '디자인컴퍼니', 
          programTypeLabel: '온라인', 
          startDate: '2025-09-20', 
          endDate: '2025-12-20', 
          costType: 'PAID', 
          imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop&crop=center', 
          venueRegion: '온라인', 
          interestCategoryLabel: '예술디자'
        },
        { 
          programId: "explore-4", 
          programTitle: '스타트업 창업 기획 체험', 
          provider: 'D.CAMP', 
          programTypeLabel: '체험처', 
          startDate: '2025-09-10', 
          endDate: '2025-11-10', 
          costType: 'FREE', 
          imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop&crop=center', 
          venueRegion: '서울', 
          interestCategoryLabel: '서비스업'
        },
        { 
          programId: "explore-5", 
          programTitle: '콘텐츠 기획자 양성 과정', 
          provider: 'CJ ENM', 
          programTypeLabel: '체험처', 
          startDate: '2025-10-15', 
          endDate: '2025-12-15', 
          costType: 'PAID', 
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center', 
          venueRegion: '서울', 
          interestCategoryLabel: '서비스업'
        },
        { 
          programId: "explore-6", 
          programTitle: '프로덕트 매니저 실무 체험', 
          provider: '라인플러스', 
          programTypeLabel: '체험처', 
          startDate: '2025-09-25', 
          endDate: '2025-11-25', 
          costType: 'FREE', 
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center', 
          venueRegion: '서울', 
          interestCategoryLabel: '서비스업'
        }
      ];

      // 간단한 필터링 시뮬레이션
      let filteredPrograms = [...ALL_PROGRAMS];
      
      // 관심 카테고리 필터링
      if (interestCategory !== 'all') {
        filteredPrograms = filteredPrograms.filter(p => p.interestCategoryLabel.includes(interestCategory));
      }
      
      // 프로그램 타입 필터링
      if (programType !== 'all') {
        filteredPrograms = filteredPrograms.filter(p => p.programTypeLabel === programType);
      }
      
      // 비용 필터링
      if (costType === 'free') {
        filteredPrograms = filteredPrograms.filter(p => p.costType === 'FREE');
      } else if (costType === 'paid') {
        filteredPrograms = filteredPrograms.filter(p => p.costType === 'PAID');
      }

      // 페이지네이션 시뮬레이션
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);

      return {
        content: paginatedPrograms,
        totalElements: filteredPrograms.length,
        totalPages: Math.ceil(filteredPrograms.length / size),
        pageNumber: page,
        pageSize: size,
        hasNext: page < Math.ceil(filteredPrograms.length / size),
        hasPrevious: page > 1
      };
    }
  }
};
