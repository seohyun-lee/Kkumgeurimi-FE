import http from './http.js';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/constants.js';

export const authService = {
  // 회원가입
  async signup(userData) {
    const response = await http.post('/auth/signup', userData);
    
    // 헤더에서 토큰 추출
    const authHeader = response.headers['authorization'] || response.headers['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7); // 'Bearer ' 제거
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    }
    // 또는 response.data에서 토큰이 올 경우 대비
    else if (response.data.accessToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.accessToken);
    }
    
    return response.data;
  },

  // 로그인
  async login(credentials) {
    console.log('[Auth Service] Attempting login...');
    const response = await http.post('/auth/login', credentials);
    const { accessToken } = response.data;

    console.log('[Auth Service] Login successful, storing token...');
    console.log('[Auth Service] Token key:', AUTH_TOKEN_KEY);
    console.log('[Auth Service] Token value:', accessToken);

    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);

    // 저장 후 확인
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    console.log('[Auth Service] Token stored successfully:', !!storedToken);

    return response.data;
  },

  // 로그아웃
  async logout() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      await http.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // 토큰 갱신
  async refreshToken() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await http.post('/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const { accessToken } = response.data;
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    
    return { accessToken };
  },

  // 현재 토큰 확인
  getCurrentToken() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    console.log('[Auth Service] getCurrentToken called, token exists:', !!token);
    console.log('[Auth Service] Using token key:', AUTH_TOKEN_KEY);
    return token;
  },

  // 로그인 상태 확인
  isAuthenticated() {
    return !!this.getCurrentToken();
  }
};
