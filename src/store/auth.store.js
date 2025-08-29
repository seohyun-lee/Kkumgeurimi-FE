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
      
      set({ 
        user: { email: credentials.email }, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '로그인에 실패했습니다.';
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
      
      // 회원가입 성공 시 토큰이 저장되었다면 사용자 상태 업데이트
      const token = authService.getCurrentToken();
      if (token) {
        set({ 
          user: { email: userData.email, name: userData.name },
          isAuthenticated: true,
          isLoading: false,
          error: null 
        });
      } else {
        set({ isLoading: false, error: null });
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '회원가입에 실패했습니다.';
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
    }
  },

  // 에러 초기화
  clearError: () => set({ error: null })
}));
