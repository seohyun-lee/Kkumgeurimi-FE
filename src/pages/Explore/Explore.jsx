import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { INTEREST_LABELS } from '../../config/constants';
import { programsService } from '../../services/programs.service.js';
import { useAuthStore } from '../../store/auth.store.js';
import { expandedMockPrograms } from '../../data/mockPrograms.js';
import ProgramCard from "../../components/ProgramCard.jsx";
import './Explore.css';

const EXPERIENCE_TYPE_CHIPS = [
  { value: "all", label: "전체" },
  { value: "field_company", label: "현장직업체험형" },
  { value: "job_practice", label: "직업실무체험형" },
  { value: "field_academic", label: "현장견학형" },
  { value: "subject", label: "학과체험형" },
  { value: "camp", label: "캠프형" },
  { value: "lecture", label: "강연형" },
  { value: "dialogue", label: "대화형" },
];

const COST_CHIPS = [
  { value: "all", label: "전체" },
  { value: "free", label: "무료" },
  { value: "paid", label: "유료" },
];

const DEFAULT_FILTERS = {
  category: 'all',
  job: 'all',
  type: 'all',
  cost: 'all',
  startDate: '2025-08-29',
  endDate: '2025-12-31',
};



function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="selectfilter">
      <span className="selectfilter__label">{label}</span>
      <select className="selectfilter__select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

function SelectedFilters({ filters, onClearKey, onReset }) {
  // ✅ value → label 헬퍼
  const labelByValue = (options, v) =>
    options.find(o => o.value === v)?.label ?? v;

  const entries = [
    filters.job !== 'all' && {
      key: 'job',
      label: '직무',
      value: labelByValue(
        [{ value: 'all', label: '전체' }, ...Object.entries(INTEREST_LABELS).map(([code, label]) => ({ value: code, label }))],
        filters.job
      ),
    },
    filters.type !== 'all' && {
      key: 'type',
      label: '체험유형',
      value: labelByValue(EXPERIENCE_TYPE_CHIPS, filters.type),
    },
    filters.cost !== 'all' && {
      key: 'cost',
      label: '비용',
      value: labelByValue(COST_CHIPS, filters.cost), // ✅ paid → 유료
    },
    ((filters.startDate !== DEFAULT_FILTERS.startDate) ||
     (filters.endDate !== DEFAULT_FILTERS.endDate)) && {
      key: 'date',
      label: '체험일',
      value: `${filters.startDate} ~ ${filters.endDate}`,
    },
  ].filter(Boolean);

  if (!entries.length) return null;

  return (
    <div className="selectedfilters">
      {entries.map(({ key, label, value }) => (
        <span key={key} className="sf-badge">
          <b>{label}</b> {value}
          <button
            className="sf-badge__x"
            aria-label={`${label} 제거`}
            onClick={() => onClearKey(key)}
          >
            ×
          </button>
        </span>
      ))}
      <button className="sf-clearall" onClick={onReset}>전체 초기화</button>
    </div>
  );
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  // URL 쿼리 동기화: ?cat=IT
  const initialCat = searchParams.get('cat') || 'all';

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: initialCat,
  });

  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState(() => new Set());
  const [modal, setModal] = useState({ open: false, program: null });

  // 찜한 프로그램 목록 조회 (로그인한 경우만)
  const { data: likedProgramsData } = useQuery({
    queryKey: ['liked-programs'],
    queryFn: programsService.getLikedPrograms,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10분
  });

  // 찜 목록 데이터를 Set으로 변환
  useEffect(() => {
    if (likedProgramsData && Array.isArray(likedProgramsData)) {
      const likedIds = new Set(likedProgramsData.map(program => program.program_id || program.id));
      setLiked(likedIds);
    }
  }, [likedProgramsData]);
  const [programs, setPrograms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;


  // 카테고리 변경 시 URL 업데이트 + 페이지 리셋
  const handleChangeCategory = (cat) => {
    setFilters((f) => ({ ...f, category: cat }));
    setPage(1);
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('cat');
    else next.set('cat', cat);
    setSearchParams(next, { replace: true });
  };


  // API 호출 함수
  const fetchPrograms = async () => {
    setLoading(true);
    
    // 목업 데이터 직접 사용 (서버 상태와 관계없이)
    console.log('목업 데이터 사용 중...');
    const filteredMockData = expandedMockPrograms.filter(program => {
      if (filters.job !== 'all' && program.interestCategoryId !== filters.job) return false;
      if (filters.type !== 'all' && program.programType !== EXPERIENCE_TYPE_CHIPS.find(chip => chip.value === filters.type)?.label) return false;
      if (filters.cost === 'free' && program.price > 0) return false;
      if (filters.cost === 'paid' && program.price === 0) return false;
      return true;
    });
    
    // 페이징 처리
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredMockData.slice(startIndex, endIndex);
    
    console.log(`필터링된 데이터: ${filteredMockData.length}개, 페이지 데이터: ${paginatedData.length}개`);
    
    setPrograms(paginatedData);
    setTotalPages(Math.ceil(filteredMockData.length / itemsPerPage));
    setTotalElements(filteredMockData.length);
    
    setLoading(false);
  };
  

  // 필터나 정렬이 변경될 때 API 호출
  useEffect(() => {
    fetchPrograms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy, page]);

  /** 이벤트 */
  const applyFilters = () => {
    setPage(1);
  };
  
  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, category: 'all' });
    setPage(1);
    const next = new URLSearchParams(searchParams);
    next.delete('cat');
    setSearchParams(next, { replace: true });
  };
  const toggleLike = async (id) => {
    const isCurrentlyLiked = liked.has(id);
    
    // 클릭 즉시 UI 업데이트 (낙관적 업데이트)
    setLiked((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    
    // 백그라운드에서 API 호출 (실패해도 UI는 이미 변경됨)
    try {
      if (isCurrentlyLiked) {
        await programsService.unlikeProgram(id);
      } else {
        await programsService.likeProgram(id);
      }
    } catch (error) {
      console.error('프로그램 찜하기 API 실패:', error);
      // API 실패 시에도 UI 변경은 유지 (사용자 경험 개선)
    }
  };
      
  useEffect(() => {
    if (modal.open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [modal.open]);
  
  return (
    <div className="explore">
      {/* 네비게이터: 카테고리 퀵 필터 (sticky 적용 가능) */}

      {/* Header */}
      <header className="explore__header">
        <div className="header__top">
          <h1 className="header__title">프로그램 탐색</h1>
          <i className="fas fa-search header__icon" aria-hidden="true" />
        </div>

      {/* 컴팩트 필터 바 */}
      <div className="filters filters--compact">
        <div className="filters__row">
          <SelectFilter
            label="직무"
            value={filters.job}
            onChange={(v) => setFilters((f) => ({ ...f, job: v }))}
            options={[
              { value: 'all', label: '전체' },
              ...Object.entries(INTEREST_LABELS).map(([code, label]) => ({ value: code, label })),
            ]}
          />
          <SelectFilter
            label="체험유형"
            value={filters.type}
            onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
            options={EXPERIENCE_TYPE_CHIPS}
          />
          <SelectFilter
            label="비용"
            value={filters.cost}
            onChange={(v) => setFilters((f) => ({ ...f, cost: v }))}
            options={COST_CHIPS}
          />
          <label className="selectfilter selectfilter--date">
            <span className="selectfilter__label">체험일</span>
            <div className="date">
              <input
                type="date"
                className="date__input"
                value={filters.startDate}
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              />
              <span>→</span>
              <input
                type="date"
                className="date__input"
                value={filters.endDate}
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </label>

          <div className="filters__actions">
            <button className="btn btn--search" onClick={applyFilters}>검색</button>
          </div>
        </div>

        {/* ✅ 선택된 필터 배지 */}
        <SelectedFilters
          filters={filters}
          onClearKey={(key) => {
            if (key === 'date') {
              setFilters(f => ({ ...f, startDate: DEFAULT_FILTERS.startDate, endDate: DEFAULT_FILTERS.endDate }));
            } else {
              setFilters(f => ({ ...f, [key]: 'all' }));
            }
            setPage(1);
          }}
          onReset={resetFilters}
        />
      </div>
    </header>

      {/* Content */}
      <section className="explore__content">
        <div className="content__top">
          <div className="results">
            {loading ? '검색 중...' : `전체 ${totalElements}개`}
          </div>
          <select className="sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="deadline">마감임박순</option>
          </select>
        </div>

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              프로그램을 검색하고 있습니다...
            </div>
          ) : programs.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              검색 결과가 없습니다.
            </div>
          ) : (
            programs.map((p) => (
              <ProgramCard
                key={p.program_id || p.id}
                program={p}
                isLiked={liked.has(p.program_id || p.id)}
                onLike={() => toggleLike(p.program_id || p.id)}
                onClick={(program) => setModal({ open: true, program })}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="페이지네이션">
            <button className="page nav" disabled={page <= 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>
              <span className="nav__arrow">‹</span>
            </button>
          
            {Array.from({ length: totalPages }).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((_, i) => {
              const first = Math.max(1, page - 2);
              const number = first + i;
              return (
                <button key={number} className={`page ${number === page ? 'active' : ''}`} onClick={() => setPage(number)}>
                  {number}
                </button>
              );
            })}
          
            <button className="page nav" disabled={page >= totalPages} onClick={() => setPage((v) => Math.min(totalPages, v + 1))}>
              <span className="nav__arrow">›</span>
            </button>
          </nav>
          
        )}
      </section>

      {/* Program Detail Modal */}
      {modal.open && modal.program && (
        <div className="program-detail-modal" onClick={() => setModal({ open: false, program: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* 헤더 */}
            <div className="modal-header">
              <button className="close-button" onClick={() => setModal({ open: false, program: null })}>
                ×
              </button>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="modal-body">
              {/* 프로그램 제목 및 제공자 */}
              <div className="program-header">
                <h2 className="program-title">{modal.program.programTitle || modal.program.title}</h2>
                <div className="program-provider">{modal.program.provider}</div>
              </div>

              {/* 프로그램 설명 */}
              {modal.program.description && (
                <div className="program-description">
                  {modal.program.description}
                </div>
              )}

              {/* 프로그램 정보 그리드 */}
              <div className="program-info-grid">
                <div className="info-item">
                  <span className="info-label">프로그램 유형</span>
                  <span className="info-value">{modal.program.programType || modal.program.program_type || "미정"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">대상</span>
                  <span className="info-value">{modal.program.targetAudience || modal.program.target_audience || "미정"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">지역</span>
                  <span className="info-value">{modal.program.eligibleRegion || modal.program.venue_region || "전국"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">참가비</span>
                  <span className="info-value">
                    {(modal.program.price === "0" || modal.program.price === 0) ? "무료" : `${Number(modal.program.price).toLocaleString()}원`}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">모집인원</span>
                  <span className="info-value">{modal.program.capacity ? `${modal.program.capacity}명` : "미정"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">운영시간</span>
                  <span className="info-value">
                    {modal.program.operateCycle && modal.program.availHours 
                      ? `${modal.program.operateCycle} ${modal.program.availHours}`
                      : (modal.program.availHours || modal.program.operateCycle || "미정")}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">장소</span>
                  <span className="info-value">{modal.program.venueRegion || modal.program.venue || "미정"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">관련직종</span>
                  <span className="info-value">{modal.program.relatedMajor || modal.program.job_field || "미정"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">기간</span>
                  <span className="info-value">
                    {modal.program.startDate && modal.program.endDate 
                      ? `${modal.program.startDate} ~ ${modal.program.endDate}`
                      : (modal.program.startDate || "미정")}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">분야</span>
                  <span className="info-value">
                    {modal.program.interestCategoryId 
                      ? INTEREST_LABELS[modal.program.interestCategoryId] || String(modal.program.interestCategoryId)
                      : (modal.program.interestText || modal.program.field_category || "미정")}
                  </span>
                </div>
                {modal.program.requiredHours && (
                  <div className="info-item">
                    <span className="info-label">필요시간</span>
                    <span className="info-value">{modal.program.requiredHours}</span>
                  </div>
                )}
                {modal.program.targetSchoolType && (
                  <div className="info-item">
                    <span className="info-label">대상학교</span>
                    <span className="info-value">{modal.program.targetSchoolType}</span>
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="action-buttons">
                <button className="btn-apply" onClick={() => {
                  console.log('프로그램 신청:', modal.program.programId || modal.program.program_id);
                  alert('프로그램 신청 기능은 준비 중입니다.');
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 5.83333H15.8333V5C15.8333 3.61917 14.7142 2.5 13.3333 2.5H6.66667C5.28583 2.5 4.16667 3.61917 4.16667 5V5.83333H3.33333C2.9525 5.83333 2.66667 6.11917 2.66667 6.5V17.5C2.66667 17.8808 2.9525 18.1667 3.33333 18.1667H16.6667C17.0475 18.1667 17.3333 17.8808 17.3333 17.5V6.5C17.3333 6.11917 17.0475 5.83333 16.6667 5.83333ZM13.3333 5.83333H6.66667V5C6.66667 4.54167 7.04167 4.16667 7.5 4.16667H12.5C12.9583 4.16667 13.3333 4.54167 13.3333 5V5.83333Z" fill="currentColor"/>
                  </svg>
                  <span>신청하기</span>
                </button>
                <button 
                  className={`btn-like ${liked.has(modal.program.programId || modal.program.program_id) ? 'liked' : ''}`} 
                  onClick={() => toggleLike(modal.program.programId || modal.program.program_id)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 16.5C10 16.5 2 11 2 6C2 3.79086 3.79086 2 6 2C7.5 2 9 3 10 4C11 3 12.5 2 14 2C16.2091 2 18 3.79086 18 6C18 11 10 16.5 10 16.5Z" stroke="currentColor" strokeWidth="1.5" fill={liked.has(modal.program.programId || modal.program.program_id) ? "currentColor" : "none"}/>
                  </svg>
                  <span>찜하기</span>
                </button>
                </div>

              {/* 커뮤니티 섹션 */}
              <div className="community-section">
                <div className="community-header">
                  <span className="community-title">💬 댓글 목록 </span>
                </div>
                <div className="community-preview">
                  <div className="chat-message">
                    <div className="user-avatar">
                      <img src="/mock_image_url/korean_woman_1.jpeg" alt="김서연" />
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="user-name">김서연</span>
                        <span className="user-badge 관심있음">관심있음</span>
                        <span className="time-ago">2시간 전</span>
                      </div>
                      <div className="message-text">
                        혹시 수성구 사시는 분들 중에 이 체험 같이 가실 분 계실까요.. 🤔
                      </div>
                    </div>
                  </div>
                  
                  <div className="chat-message">
                    <div className="user-avatar">
                      <img src="/mock_image_url/korean_man_1.jpeg" alt="박민수" />
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="user-name">박민수</span>
                        <span className="user-badge">신청완료</span>
                        <span className="time-ago">1시간 전</span>
                      </div>
                      <div className="message-text">
                        @김서연 저요!! 오픈채팅 링크: https://open.kakao.com/o/biotechlab2025 여기로 들어와주세요~~~~
                      </div>
                    </div>
                  </div>
                  
                  <div className="chat-message">
                    <div className="user-avatar">
                      <img src="/mock_image_url/korean_woman_2.jpeg" alt="이지은" />
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="user-name">이지은</span>
                        <span className="user-badge 관심있음">관심있음</span>
                        <span className="time-ago">30분 전</span>
                      </div>
                      <div className="message-text">
                        @박민수 저도 관심 있는데 연락드려도 될까요?
                      </div>
                    </div>
                  </div>
                  
                  <div className="chat-message">
                    <div className="user-avatar">
                      <img src="/mock_image_url/korean_man_2.jpeg" alt="최준호" />
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="user-name">최준호</span>
                        <span className="time-ago">15분 전</span>
                      </div>
                      <div className="message-text">
                      아 이런거 서울에는 없나..ㅠㅠ
                      </div>
                    </div>
                  </div>
                  
                  <div className="chat-message">
                    <div className="user-avatar">
                      <img src="/mock_image_url/korean_woman_1.jpeg" alt="정다은" />
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="user-name">정다은</span>
                        <span className="user-badge 관심있음">관심있음</span>
                        <span className="time-ago">5분 전</span>
                      </div>
                      <div className="message-text">
                        헉 신청 마감됐네요..ㅠㅠ 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
