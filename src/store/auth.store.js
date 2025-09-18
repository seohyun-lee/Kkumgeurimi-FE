import { create } from 'zustand';
import { authService } from '../services/auth.service.js';
import { meService } from '../services/my.service.js';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/constants.js';

export const useAuthStore = create((set, get) => ({
  // 상태
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialized: false, // 초기화 여부 추가

  // 토큰 getter
  get token() {
    return authService.getCurrentToken();
  },

  // 액션
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  // 로그인
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login(credentials);
      
      // 로그인 성공 후 사용자 정보 가져오기
      try {
        const userProfile = await meService.getProfile();
        set({ 
          user: userProfile, 
          isAuthenticated: true, 
          isLoading: false, 
          error: null 
        });
      } catch (profileError) {
        console.error('Failed to fetch user profile:', profileError);
        // 프로필 가져오기 실패해도 로그인은 성공으로 처리
        set({ 
          user: { email: credentials.email }, 
          isAuthenticated: true, 
          isLoading: false, 
          error: null 
        });
      }
      
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
    const { initialized } = get();
    if (initialized) {
      console.log('[Auth Store] Already initialized, skipping...');
      return;
    }

    console.log('[Auth Store] Starting initialization...');
    const token = authService.getCurrentToken();
    console.log('[Auth Store] Token found:', !!token);

    if (token) {
      console.log('[Auth Store] Token found - setting authenticated state');
      // 토큰이 있으면 일단 로그인 상태로 설정
      set({
        user: null, // 사용자 정보는 필요할 때만 가져옴
        isAuthenticated: true,
        isLoading: false,
        initialized: true
      });
    } else {
      console.log('[Auth Store] No token found, setting unauthenticated state');
      // 토큰이 없으면 인증되지 않은 상태로 설정
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        initialized: true
      });
    }
  },

  // 사용자 프로필 가져오기 (필요할 때만 호출)
  fetchUserProfile: async () => {
    const { user, isAuthenticated } = get();
    if (!isAuthenticated || user) {
      return; // 이미 프로필이 있거나 인증되지 않은 경우 스킵
    }

    try {
      console.log('[Auth Store] Fetching user profile...');
      const userProfile = await meService.getProfile();
      console.log('[Auth Store] User profile fetched successfully:', userProfile);
      set({ user: userProfile });
    } catch (error) {
      console.warn('[Auth Store] Failed to fetch user profile:', error);
      // 프로필 가져오기 실패해도 로그인 상태는 유지
    }
  },

  // 에러 초기화
  clearError: () => set({ error: null })
}));
