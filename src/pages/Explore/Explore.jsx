import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { INTEREST_LABELS } from '../../config/constants';
import { programsService } from '../../services/programs.service.js';
import { useAuthStore } from '../../store/auth.store.js';
import ProgramCard from "../../components/ProgramCard.jsx";
import ProgramDetailModal from "../../components/ProgramDetailModal.jsx";
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
    try {
      const response = await programsService.searchPrograms({
        interestCategory: filters.job,
        programType: filters.type,
        cost: filters.cost,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy,
        page,
        size: itemsPerPage
      });
      
      // 실제 API 응답 구조에 맞게 수정
      setPrograms(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('프로그램 검색 실패:', error);
      setPrograms([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };
  

  // 필터나 정렬이 변경될 때 API 호출
  useEffect(() => {
    fetchPrograms();
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
    try {
      const isCurrentlyLiked = liked.has(id);
      
      if (isCurrentlyLiked) {
        await programsService.unlikeProgram(id);
      } else {
        await programsService.likeProgram(id);
      }
      
      // API 성공 시 UI 업데이트
      setLiked((prev) => {
        const next = new Set(prev);
        if (isCurrentlyLiked) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    } catch (error) {
      console.error('프로그램 찜하기 실패:', error);
      // TODO: 사용자에게 에러 메시지 표시
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
                key={p.program_id}
                program={p}
                isLiked={liked.has(p.program_id)}
                onLike={toggleLike}
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

      <ProgramDetailModal
        program={modal.program}
        isOpen={modal.open}
        onClose={() => setModal({ open: false, program: null })}
        isLiked={modal.program ? liked.has(modal.program.programId || modal.program.program_id) : false}
        onLike={toggleLike}
        onApply={(programId) => {
          // TODO: 프로그램 신청 로직 구현
          console.log('프로그램 신청:', programId);
          alert('프로그램 신청 기능은 준비 중입니다.');
        }}
      />
    </div>
  );
}
