import React from 'react';
import { Outlet, createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import AppShell from '../layouts/AppShell.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import OnboardingLayout from '../layouts/OnboardingLayout.jsx';
import { useAuthStore } from '../store/auth.store.js';
import SignIn from '../pages/SignIn/SignIn.jsx';
import SignUp from '../pages/SignUp/Sign-Up.jsx';
import Interests from '../pages/Interests/Interests.jsx';
import Home from '../pages/Home/Home.jsx';
import Assistant from '../pages/Assistant/Assistant.jsx';
import Explore from '../pages/Explore/Explore.jsx';
import Career from '../pages/Career/Career.jsx';
import MyPage from '../pages/MyPage/MyPage.jsx';
import NotFound from "../pages/NotFound/NotFound.jsx";

// 페이지 컴포넌트들 (임시)
const ProgramDetail = () => <div>프로그램 상세 페이지</div>;
const Me = () => <div>내 정보 페이지</div>;
const MeRegistrations = () => <div>내 신청 페이지</div>;
const MeLikes = () => <div>내 찜 페이지</div>;

export const ProtectedLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated) {
    // 로그인 후 원래 가려던 경로로 돌아가도록 state에 from 저장
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

const GuestLayout = () => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "explore", element: <Explore /> },
      { path: "career", element: <Career /> },
      { path: "programs/:programId", element: <ProgramDetail /> },
      { path: "assistant", element: <Assistant /> },
      { path: "me", element: <MyPage /> },
      // 보호 구역
      {
        element: <ProtectedLayout />,
        children: [
          { path: "me", element: <Me /> },
          { path: "me/registrations", element: <MeRegistrations /> },
          { path: "me/likes", element: <MeLikes /> },
        ],
      },
      { path: "signin", element: <Navigate to="/auth/signin" replace /> },
      { path: "signup", element: <Navigate to="/auth/signup" replace /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  // 온보딩 섹션- 로그인 사용자만
  {
    element: <OnboardingLayout />,
    children: [
      {
        path: "/onboarding",
        element: <GuestLayout />, /*<ProtectedLayout />,*/
        children: [
          { path: "interests", element: <Interests /> },
        ],
      },
    ],
  },

  // 인증 섹션
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        element: <GuestLayout />, // 로그인된 유저는 접근 불가
        children: [
          { index: true, element: <Navigate to="signin" replace /> }, // /auth -> /auth/signin
          { path: "signin", element: <SignIn /> },
          { path: "signup", element: <SignUp /> },
        ],
      },
    ],
  },

  // 최상위 404 (전역)
  { path: "*", element: <NotFound /> },
]);
