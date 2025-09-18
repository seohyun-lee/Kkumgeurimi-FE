import React, { useEffect, useCallback } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes/index.jsx';
import { useAuthStore } from './store/auth.store.js';
import "./styles/design-tokens.css";
import "./styles/brand-logo.css";

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

function App() {
  const { initialize, isLoading } = useAuthStore();

  const initializeAuth = useCallback(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // 앱 시작 시 인증 상태 초기화 (한 번만)
    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        로딩 중...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
