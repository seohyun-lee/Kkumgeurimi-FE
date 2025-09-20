import http from './http.js';

export const meService = {
  // 내 프로필 조회
  async getProfile() {
    const response = await http.get('/my');
    return response.data;
  },

  // 프로필 수정
  async updateProfile(profileData) {
    const response = await http.patch('/my', profileData);
    return response.data;
  },

  // 회원탈퇴
  async deleteAccount() {
    const response = await http.delete('/my');
    return response.data;
  },

  // 내 신청 목록 조회
  async getRegistrations(status = null) {
    const params = status ? { status } : {};
    const response = await http.get('/my/programs/registrations', { params });
    return response.data;
  },

  // 내 찜 목록 조회
  async getLikes() {
    const response = await http.get('/my/programs/likes');
    return response.data;
  },

  // 완료된 프로그램 목록 조회
  async getCompletedPrograms() {
    const response = await http.get('/my/completed');
    return response.data;
  },

  // 리뷰 작성
  async createReview(programRegistrationId, reviewData) {
    try {
      const requestPayload = {
        reviewScore: String(reviewData.score),
        reviewMessage: reviewData.message
      };

      const response = await http.post(`/reviews/${programRegistrationId}`, requestPayload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 내 진로 정보 조회
  async getCareer() {
    const response = await http.get('/my/career');
    return response.data;
  },

  // 진로 정보 수정
  async updateCareer(careerData) {
    const response = await http.patch('/my/career', careerData);
    return response.data;
  },

  // 관심 분야 등록 (회원가입 시)
  async createInterests(interestData) {
    const response = await http.post('/my/interests', interestData);
    return response.data;
  },

  // 학교급 정보 조회
  async getSchoolLevel() {
    try {
      const response = await http.get('/my/schoollevel');
      return response.data;
    } catch (error) {
      console.error('학교급 조회 실패:', error);
      // 실패 시 기본값 '고' 반환
      return '고';
    }
  },

  // 참여 예정 프로그램 목록 조회
  async getUpcomingPrograms() {
    try {
      const response = await http.get('/my/upcoming');
      return response.data;
    } catch (error) {
      console.error('참여 예정 프로그램 조회 실패:', error);
      // API 호출 실패 시 더미 데이터 반환
      return [
        {
          programId: "upcoming-1",
          programTitle: "서비스 기획자 직무 체험",
          provider: "네이버 커넥트재단",
          programTypeLabel: "체험처",
          startDate: "2025-09-20",
          endDate: "2025-09-20",
          costType: "FREE",
          imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center",
          venueRegion: "서울",
          interestCategoryLabel: "서비스업"
        },
        {
          programId: "upcoming-2",
          programTitle: "마케팅 전략 수립 워크샵",
          provider: "카카오 임팩트",
          programTypeLabel: "체험처",
          startDate: "2025-09-21",
          endDate: "2025-09-21",
          costType: "PAID",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center",
          venueRegion: "경기",
          interestCategoryLabel: "서비스업"
        }
      ];
    }
  }
};
