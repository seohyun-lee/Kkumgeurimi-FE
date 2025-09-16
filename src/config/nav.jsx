import { ROUTES } from './constants';

// 홈 아이콘 - 너비 축소
const HomeIcon = ({ isActive }) => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 9L10 2L18 9V20C18 20.5 17.5 21 17 21H13V15C13 13.9 12.1 13 11 13H9C7.9 13 7 13.9 7 15V21H3C2.5 21 2 20.5 2 20V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 탐색 아이콘
const ExploreIcon = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// 진로 아이콘
const CareerIcon = ({ isActive }) => (
  <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 21C16.5 18 21 14.5 21 10C21 5.5 17 2 13 2C9 2 5 5.5 5 10C5 14.5 9.5 18 13 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 12C14.1 12 15 11.1 15 10C15 8.9 14.1 8 13 8C11.9 8 11 8.9 11 10C11 11.1 11.9 12 13 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 커뮤니티 아이콘
const CommunityIcon = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 3H17C18.5 3 20 4.5 20 6V13C20 14.5 18.5 16 17 16H13L9 20V16H7C5.5 16 4 14.5 4 13V6C4 4.5 5.5 3 7 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="9.5" r="1" fill="currentColor"/>
    <circle cx="12" cy="9.5" r="1" fill="currentColor"/>
    <circle cx="16" cy="9.5" r="1" fill="currentColor"/>
  </svg>
);

// 마이페이지 아이콘
const MyPageIcon = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 11C13.5 11 14.5 10 14.5 8.5C14.5 7 13.5 6 12 6C10.5 6 9.5 7 9.5 8.5C9.5 10 10.5 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 18.5C17 20 15 21 12 21C9 21 7 20 6 18.5C6.2 17.5 7 16.5 8 16C10 15 14 15 16 16C17 16.5 17.8 17.5 18 18.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const NAV_ITEMS = [
  { id: 'home',      label: '홈',     icon: HomeIcon,      path: ROUTES.HOME },
  { id: 'search',    label: '탐색',   icon: ExploreIcon,   path: ROUTES.EXPLORE },
  { id: 'career',    label: '진로',   icon: CareerIcon,    path: ROUTES.CAREER },
  { id: 'community', label: '꿈터', icon: CommunityIcon, path: ROUTES.COMMUNITY },
  { id: 'mypage',    label: 'MY',     icon: MyPageIcon,    path: ROUTES.ME },
];