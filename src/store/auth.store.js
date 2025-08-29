import { create } from 'zustand';
import { authService } from '../services/auth.service.js';

export const useAuthStore = create((set, get) => ({
  // 상태
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // 액션
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  // 로그인
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login(credentials);
      const user = response.user || { email: credentials.email }; // API 응답에 따라 조정
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || '로그인에 실패했습니다.';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  // 회원가입
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.signup(userData);
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || '회원가입에 실패했습니다.';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      });
    }
  },

  // 토큰 갱신
  refreshToken: async () => {
    try {
      const { accessToken } = await authService.refreshToken();
      // 토큰이 갱신되면 사용자 정보도 다시 가져올 수 있음
      return accessToken;
    } catch (error) {
      // 토큰 갱신 실패 시 로그아웃
      get().logout();
      throw error;
    }
  },

  // 초기화 (앱 시작 시 호출)
  initialize: async () => {
    const token = authService.getCurrentToken();
    if (token) {
      set({ isAuthenticated: true });
      // 더미 사용자 정보 설정 (API가 없을 때)
      const dummyUser = {
        id: 1,
        email: 'test@example.com',
        name: '테스트 사용자',
        profileImage: 'https://via.placeholder.com/100x100/3b82f6/ffffff?text=User'
      };
      set({ user: dummyUser });
    }
  },

  // 에러 초기화
  clearError: () => set({ error: null })
}));
