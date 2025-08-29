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
  },

  // 프로그램 검색 (Explore 페이지용)
  async searchPrograms({
    interestCategory = 'all',
    programType = 'all',
    cost = 'all',
    startDate = '2025-08-29',
    endDate = '2025-12-31',
    sortBy = 'latest',
    page = 1,
    size = 10
  } = {}) {
    const params = new URLSearchParams();
    
    if (interestCategory !== 'all') params.append('interestCategory', interestCategory);
    if (programType !== 'all') params.append('programType', programType);
    if (cost !== 'all') params.append('cost', cost);
    
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
      
      // 더미 데이터로 필터링 시뮬레이션
      const ALL_PROGRAMS = [
        { program_id: 1, title: 'AI 기초 프로그래밍 체험', provider: '테크 이노베이션 센터', program_type: '체험활동', venue_region: '서울', field_category: 'IT', target_audience: '고등학생', start_date: '2025-09-15', end_date: '2025-12-15', price: '무료', description: '인공지능의 기초 개념을 학습하고 간단한 AI 모델을 직접 구현해보는 프로그램입니다.', capacity: 30, avail_hours: '매주 토요일 14:00-17:00', venue: '강남구 테크센터', job_field: '개발자', interest_category: '2' }, // ICT R&D Engineering
        { program_id: 2, title: '창의 디자인 워크샵', provider: '크리에이티브 스튜디오', program_type: '워크샵', venue_region: '경기', field_category: '디자인', target_audience: '중학생, 고등학생', start_date: '2025-10-01', end_date: '2025-11-30', price: '50,000원', description: '디자인 씽킹을 바탕으로 창의적인 문제 해결 능력을 기르는 프로그램입니다.', capacity: 25, avail_hours: '매주 일요일 10:00-16:00', venue: '수원시 크리에이티브센터', job_field: '디자이너', interest_category: '11' }, // Arts, Design, Media
        { program_id: 3, title: '로봇공학 체험교실', provider: '미래과학관', program_type: '실험체험', venue_region: '서울', field_category: '과학', target_audience: '중학생', start_date: '2025-09-20', end_date: '2025-12-20', price: '무료', description: '로봇의 원리를 이해하고 직접 조립하며 프로그래밍하는 체험 프로그램입니다.', capacity: 20, avail_hours: '매주 수요일 16:00-18:00', venue: '종로구 과학관', job_field: '연구원', interest_category: '1' }, // Natural/Bio Science Research
        { program_id: 4, title: '디지털 아트 창작', provider: '아트테크 스쿨', program_type: '창작활동', venue_region: '부산', field_category: '예술', target_audience: '고등학생, 대학생', start_date: '2025-09-10', end_date: '2025-11-10', price: '80,000원', description: '최신 디지털 도구를 활용한 현대적인 아트워크 제작 프로그램입니다.', capacity: 15, avail_hours: '매주 금요일 19:00-22:00', venue: '해운대구 아트센터', job_field: '디자이너', interest_category: '11' }, // Arts, Design, Media
        { program_id: 5, title: '바이오테크 실험실 체험', provider: '생명과학연구소', program_type: '실험체험', venue_region: '대구', field_category: '과학', target_audience: '고등학생', start_date: '2025-10-15', end_date: '2025-12-15', price: '무료', description: '최첨단 바이오 기술을 직접 경험하고 미래 생명과학의 가능성을 탐구합니다.', capacity: 18, avail_hours: '매주 토요일 09:00-12:00', venue: '수성구 바이오센터', job_field: '연구원', interest_category: '1' }, // Natural/Bio Science Research
        { program_id: 6, title: '스포츠 심리학 워크샵', provider: '스포츠 심리연구원', program_type: '워크샵', venue_region: '서울', field_category: '체육', target_audience: '고등학생, 대학생', start_date: '2025-09-25', end_date: '2025-11-25', price: '60,000원', description: '운동선수들의 심리적 컨디션 관리와 멘탈 트레이닝 기법을 배웁니다.', capacity: 22, avail_hours: '매주 화요일 18:00-21:00', venue: '송파구 스포츠센터', job_field: '기획자', interest_category: '12' }, // Sports & Recreation
        { program_id: 7, title: '웹 개발 부트캠프', provider: '코딩 아카데미', program_type: '체험활동', venue_region: '서울', field_category: 'IT', target_audience: '대학생', start_date: '2025-08-20', end_date: '2025-10-20', price: '무료', description: '웹 개발의 전 과정을 체험하고 실제 웹사이트를 만들어보는 프로그램입니다.', capacity: 24, avail_hours: '매주 토요일 10:00-18:00', venue: '강남구 코딩센터', job_field: '개발자', interest_category: '2' }, // ICT R&D Engineering
        { program_id: 8, title: '패션 디자인 아틀리에', provider: '패션 크리에이터 센터', program_type: '창작활동', venue_region: '경기', field_category: '디자인', target_audience: '고등학생', start_date: '2025-09-05', end_date: '2025-11-05', price: '120,000원', description: '패션 디자인의 기초부터 실제 의상 제작까지 경험하는 창작 프로그램입니다.', capacity: 16, avail_hours: '매주 일요일 13:00-17:00', venue: '성남시 패션센터', job_field: '디자이너', interest_category: '11' }, // Arts, Design, Media
      ];

      // 간단한 필터링 시뮬레이션
      let filteredPrograms = [...ALL_PROGRAMS];
      
      // 관심 카테고리 필터링
      if (interestCategory !== 'all') {
        filteredPrograms = filteredPrograms.filter(p => p.interest_category === interestCategory);
      }
      
      // 프로그램 타입 필터링
      if (programType !== 'all') {
        filteredPrograms = filteredPrograms.filter(p => p.program_type === programType);
      }
      
      // 비용 필터링
      if (cost === 'free') {
        filteredPrograms = filteredPrograms.filter(p => p.price === '무료');
      } else if (cost === 'paid') {
        filteredPrograms = filteredPrograms.filter(p => p.price !== '무료');
      }

      // 페이지네이션 시뮬레이션
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);

      return {
        programs: paginatedPrograms,
        totalElements: filteredPrograms.length,
        totalPages: Math.ceil(filteredPrograms.length / size),
        currentPage: page,
        pageSize: size
      };
    }
  }
};
