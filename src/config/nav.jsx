import { ROUTES } from './constants';
import { ReactComponent as _ } from 'react';

const HomeIcon = ({ isActive }) => (
  <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 채움도 currentColor로 고정 */}
    <path
      fillRule="evenodd" clipRule="evenodd"
      d="M1.77212 7.09087C1.28495 7.46978 1 8.05239 1 8.66957V18.1724C1 18.6778 1.20077 19.1625 1.55815 19.5199C1.91552 19.8772 2.40023 20.078 2.90563 20.078H6.71688V15.4084C6.71688 14.3038 7.61231 13.4084 8.71688 13.4084H10.4338C11.5383 13.4084 12.4338 14.3038 12.4338 15.4084V20.078H16.245C16.7504 20.078 17.2352 19.8772 17.5925 19.5199C17.9499 19.1625 18.1507 18.6778 18.1507 18.1724V8.66957C18.1507 8.05239 17.8657 7.46978 17.3786 7.09087L10.8032 1.97672C10.081 1.41499 9.06968 1.41499 8.34746 1.97672L1.77212 7.09087Z"
      fill="currentColor"
    />
    <path d="M1.77212 7.09087L1.34236 6.53832L1.77212 7.09087ZM1.55815 19.5199L2.05312 19.0249L2.05312 19.0249L1.55815 19.5199ZM6.71688 20.078V20.778C7.10348 20.778 7.41688 20.4646 7.41688 20.078H6.71688ZM12.4338 20.078H11.7338C11.7338 20.4646 12.0472 20.778 12.4338 20.778V20.078ZM17.5925 19.5199L17.0976 19.0249H17.0976L17.5925 19.5199ZM17.3786 7.09087L17.8083 6.53832L17.3786 7.09087ZM10.8032 1.97672L11.233 1.42417V1.42417L10.8032 1.97672ZM8.34746 1.97672L8.77722 2.52926V2.52926L8.34746 1.97672Z"
      fill="currentColor"
    />
  </svg>
);
const SearchIcon = ({ isActive }) => ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9 2a7 7 0 100 14 7 7 0 000-14z" stroke="currentColor" strokeWidth="2" fill={isActive ? 'currentColor' : 'none'}/> <path d="m15 15 4 4" stroke="currentColor" strokeWidth="2"/> </svg> );
const CareerIcon = ({ isActive }) => ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3 6a3 3 0 013-3h8a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" stroke="currentColor" strokeWidth="2" fill={isActive ? 'currentColor' : 'none'}/> <path d="M7 9h6M7 13h4" stroke="currentColor" strokeWidth="2"/> </svg> );
const ChatIcon = ({ isActive }) => ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10 2C5.6 2 2 5.6 2 10c0 1.8.6 3.5 1.7 4.9L2 18l3.1-1.7C6.5 17.4 8.2 18 10 18c4.4 0 8-3.6 8-8s-3.6-8-8-8z" stroke="currentColor" strokeWidth="2" fill={isActive ? 'currentColor' : 'none'}/> <circle cx="7" cy="10" r="1" fill="currentColor"/> <circle cx="10" cy="10" r="1" fill="currentColor"/> <circle cx="13" cy="10" r="1" fill="currentColor"/> </svg> );
const MyPageIcon = ({ isActive }) => ( <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="2" fill={isActive ? 'currentColor' : 'none'}/> <path d="M4 20c0-4.4 2.7-8 6-8s6 3.6 6 8" stroke="currentColor" strokeWidth="2"/> </svg> );

export const NAV_ITEMS = [
  { id: 'home',      label: '홈',  icon: HomeIcon,   path: ROUTES.HOME },          // '/'
  { id: 'explore',   label: '탐색', icon: SearchIcon, path: ROUTES.EXPLORE },       // '/explore'
  { id: 'career',    label: '진로', icon: CareerIcon, path: ROUTES.CAREER },        // '/career' (없으면 라우트 추가)
  { id: 'assistant', label: 'AI',   icon: ChatIcon,   path: ROUTES.ASSISTANT },     // '/assistant'
  { id: 'me',        label: 'MY',   icon: MyPageIcon, path: ROUTES.ME },            // '/mypage' 대신 상수 사용
];
