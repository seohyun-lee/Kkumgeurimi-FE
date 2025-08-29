import http from './http.js';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/constants.js';

// 더미 사용자 데이터
const dummyUser = {
  id: 1,
  email: 'test@example.com',
  name: '테스트 사용자',
  profileImage: 'https://via.placeholder.com/100x100/3b82f6/ffffff?text=User'
};

export const authService = {
  // 회원가입
  async signup(userData) {
    try {
      const response = await http.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패, 더미 응답 사용:', error.message);
      // API가 없을 때 성공 응답 시뮬레이션
      return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: dummyUser
      };
    }
  },

  // 로그인
  async login(credentials) {
    try {
      const response = await http.post('/auth/login', credentials);
      const { accessToken, refreshToken } = response.data;
      
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패, 더미 응답 사용:', error.message);
      // API가 없을 때 성공 응답 시뮬레이션
      const dummyTokens = {
        accessToken: 'dummy-access-token-' + Date.now(),
        refreshToken: 'dummy-refresh-token-' + Date.now()
      };
      
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem(AUTH_TOKEN_KEY, dummyTokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, dummyTokens.refreshToken);
      
      return {
        success: true,
        message: '로그인이 완료되었습니다.',
        accessToken: dummyTokens.accessToken,
        refreshToken: dummyTokens.refreshToken,
        user: dummyUser
      };
    }
  },

  // 로그아웃
  async logout() {
    try {
      await http.post('/auth/logout');
    } catch (error) {
      console.warn('API 호출 실패:', error.message);
    } finally {
      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  // 토큰 갱신
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await http.post('/auth/refresh', { refreshToken });
      const { accessToken } = response.data;
      
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      return { accessToken };
    } catch (error) {
      console.warn('API 호출 실패:', error.message);
      // API가 없을 때 더미 토큰 생성
      const dummyAccessToken = 'dummy-access-token-' + Date.now();
      localStorage.setItem(AUTH_TOKEN_KEY, dummyAccessToken);
      return { accessToken: dummyAccessToken };
    }
  },

  // 현재 토큰 확인
  getCurrentToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // 로그인 상태 확인
  isAuthenticated() {
    return !!this.getCurrentToken();
  }
};
