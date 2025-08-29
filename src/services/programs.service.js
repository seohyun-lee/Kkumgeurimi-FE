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
      const response = await http.post(`/programs/${programId}/likes`);
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
      const response = await http.delete(`/programs/${programId}/likes`);
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패:', error.message);
      // API가 없을 때 성공 응답 시뮬레이션
      return { success: true, message: '찜하기 취소 완료' };
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
  }
};
