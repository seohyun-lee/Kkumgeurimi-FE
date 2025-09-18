import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { INTEREST_CATEGORIES } from '../../config/constants';
import { programsService } from '../../services/programs.service.js';
import { useAuthStore } from '../../store/auth.store.js';
import ProgramCardBasic from "../../components/ProgramCardBasic.jsx";
import { useProgramModal } from '../../contexts/ProgramModalContext.jsx';
import './Explore.css';

const PROGRAM_TYPE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "0", label: "진로체험" },
  { value: "1", label: "현장견학" },
  { value: "2", label: "워크샵" },
  { value: "3", label: "세미나" },
  { value: "4", label: "캠프" },
  { value: "5", label: "인턴십" },
  { value: "6", label: "기타" },
];

const COST_TYPE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "FREE", label: "무료" },
  { value: "PAID", label: "유료" },
];

const TARGET_AUDIENCE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "중", label: "중학생" },
  { value: "고", label: "고등학생" },
];

const SORT_OPTIONS = [
  { value: "LATEST", label: "최신순" },
  { value: "POPULAR", label: "인기순" },
  { value: "DEADLINE", label: "마감임박순" },
];

const getDefaultDates = () => {
  const today = new Date();
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(today.getMonth() + 3);

  return {
    startDate: today.toISOString().split('T')[0],
    endDate: threeMonthsLater.toISOString().split('T')[0]
  };
};

const DEFAULT_FILTERS = {
  interestCategory: '',
  programType: '',
  costType: '',
  targetAudience: '',
  keyword: '',
  ...getDefaultDates(),
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

function SelectedFilters({ filters, onClearKey }) {
  const labelByValue = (options, v) =>
    options.find(o => o.value === v)?.label ?? v;

  const defaults = getDefaultDates();
  const entries = [
    filters.keyword && {
      key: 'keyword',
      label: '검색어',
      value: filters.keyword,
    },
    filters.interestCategory && {
      key: 'interestCategory',
      label: '관심분야',
      value: labelByValue(
        INTEREST_CATEGORIES.map(cat => ({ value: cat.code.toString(), label: cat.label })),
        filters.interestCategory
      ),
    },
    filters.programType && {
      key: 'programType',
      label: '프로그램유형',
      value: labelByValue(PROGRAM_TYPE_OPTIONS, filters.programType),
    },
    filters.costType && {
      key: 'costType',
      label: '비용',
      value: labelByValue(COST_TYPE_OPTIONS, filters.costType),
    },
    filters.targetAudience && {
      key: 'targetAudience',
      label: '대상',
      value: labelByValue(TARGET_AUDIENCE_OPTIONS, filters.targetAudience),
    },
    ((filters.startDate !== defaults.startDate) ||
     (filters.endDate !== defaults.endDate)) && {
      key: 'date',
      label: '체험기간',
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
    </div>
  );
}

export default function Explore() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('LATEST');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(() => {
    return localStorage.getItem('explore-filters-expanded') !== 'false';
  });

  // URL 쿼리 파라미터에서 필터 상태 복원 및 페이지 이동 시 상태 유지
  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (Object.keys(params).length > 0) {
      setFilters(prev => ({ ...prev, ...params }));
    }
  }, [searchParams]);

  // 필터 변경 시 URL 업데이트로 상태 유지
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      }
    });

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    if (newUrl !== window.location.search) {
      window.history.replaceState({}, '', `${window.location.pathname}${newUrl}`);
    }
  }, [filters]);

  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState(() => new Set());
  const { openModal } = useProgramModal();

  const { data: likedProgramsData } = useQuery({
    queryKey: ['liked-programs'],
    queryFn: programsService.getLikedPrograms,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (likedProgramsData && Array.isArray(likedProgramsData)) {
      const likedIds = new Set(likedProgramsData.map(program => program.programId || program.program_id || program.id));
      setLiked(likedIds);
    }
  }, [likedProgramsData]);

  const [programs, setPrograms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // 필터 확장/축소 상태 토글
  const toggleFiltersExpanded = () => {
    const newState = !isFiltersExpanded;
    setIsFiltersExpanded(newState);
    localStorage.setItem('explore-filters-expanded', String(newState));
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // 검색 핸들러
  const handleSearch = () => {
    setPage(1);
    fetchPrograms();
  };

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await programsService.searchPrograms({
        interestCategory: filters.interestCategory || undefined,
        programType: filters.programType || undefined,
        costType: filters.costType || undefined,
        targetAudience: filters.targetAudience || undefined,
        keyword: filters.keyword || undefined,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy,
        page,
        size: itemsPerPage
      });

      setPrograms(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);

      console.log('백엔드 응답 페이지 정보:', {
        pageNumber: response.pageNumber,
        totalPages: response.totalPages,
        totalElements: response.totalElements
      });
    } catch (error) {
      console.error('프로그램 검색 실패:', error);
      setPrograms([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, page, itemsPerPage]);

  // 페이지나 정렬이 변경될 때만 API 호출 (필터는 수동 검색)
  useEffect(() => {
    fetchPrograms();
  }, [sortBy, page, fetchPrograms]);

  // 초기 로드
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setTimeout(() => fetchPrograms(), 0);
  };

  const handleProgramClick = (program) => {
    openModal(program.programId);
  };

  const handleLikeProgram = async (program) => {
    try {
      if (liked.has(program.programId)) {
        await programsService.unlikeProgram(program.programId);
        setLiked(prev => {
          const newSet = new Set(prev);
          newSet.delete(program.programId);
          return newSet;
        });
      } else {
        await programsService.likeProgram(program.programId);
        setLiked(prev => {
          const newSet = new Set(prev);
          newSet.add(program.programId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('프로그램 찜하기 실패:', error);
    }
  };

  const handleApplyProgram = (program) => {
    alert(`${program.programTitle} 프로그램에 신청합니다!`);
    handleCloseModal();
  };

  return (
    <div className="explore">
      <header className="explore__header">
        <div className="header__top">
          <h1 className="header__title">프로그램 탐색</h1>
          <i className="fas fa-search header__icon" aria-hidden="true" />
        </div>

        {/* 검색바 */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="프로그램명, 기관명, 관련 전공으로 검색"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="search-input"
          />
          <button className="search-button" onClick={handleSearch}>
            <svg className="community__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" strokeWidth="2"/>
            </svg>
          </button>
        </div>

      {/* 필터 섹션 */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>필터</h3>
          <button
            className="toggle-filters-btn"
            onClick={toggleFiltersExpanded}
            aria-expanded={isFiltersExpanded}
          >
            {isFiltersExpanded ? '접기' : '펼치기'}
            <i className={`fas fa-chevron-${isFiltersExpanded ? 'up' : 'down'}`} />
          </button>
        </div>

        {isFiltersExpanded && (
          <div className="filters filters--expanded">
            <div className="filters__row">
              <SelectFilter
                label="관심분야"
                value={filters.interestCategory}
                onChange={(v) => handleFilterChange('interestCategory', v)}
                options={[
                  { value: '', label: '전체' },
                  ...INTEREST_CATEGORIES.map(cat => ({ value: cat.code.toString(), label: cat.label })),
                ]}
              />
              <SelectFilter
                label="프로그램 유형"
                value={filters.programType}
                onChange={(v) => handleFilterChange('programType', v)}
                options={PROGRAM_TYPE_OPTIONS}
              />
              <SelectFilter
                label="비용"
                value={filters.costType}
                onChange={(v) => handleFilterChange('costType', v)}
                options={COST_TYPE_OPTIONS}
              />
              <SelectFilter
                label="대상"
                value={filters.targetAudience}
                onChange={(v) => handleFilterChange('targetAudience', v)}
                options={TARGET_AUDIENCE_OPTIONS}
              />
            </div>

            <div className="filters__row filters__row--date">
              <label className="selectfilter selectfilter--date">
                <span className="selectfilter__label">체험 기간</span>
                <div className="date">
                  <input
                    type="date"
                    className="date__input"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                  <span>~</span>
                  <input
                    type="date"
                    className="date__input"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </label>
            </div>

            <div className="filters__actions">
              <button className="btn btn--reset" onClick={resetFilters}>초기화</button>
              <button className="btn btn--apply" onClick={handleSearch}>필터 적용</button>
            </div>

            {/* 선택된 필터 배지 */}
            <SelectedFilters
              filters={filters}
              onClearKey={(key) => {
                if (key === 'date') {
                  const defaults = getDefaultDates();
                  setFilters(prev => ({
                    ...prev,
                    startDate: defaults.startDate,
                    endDate: defaults.endDate
                  }));
                } else {
                  setFilters(prev => ({ ...prev, [key]: '' }));
                }
                setPage(1);
              }}
              onReset={resetFilters}
            />
          </div>
        )}
        </div>
      </header>

    <section className="explore__content">
        <div className="content__top">
          <div className="results">
            {loading ? '검색 중...' : `전체 ${totalElements}개`}
          </div>
          <select className="sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
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
              <ProgramCardBasic
                key={p.programId || p.program_id || p.id}
                title={p.programTitle || p.title}
                organization={p.provider || p.mentor}
                date={`${p.startDate} ~ ${p.endDate}`}
                category={p.interestCategoryLabel}
                tags={[p.programTypeLabel, p.costType === 'FREE' ? '무료' : '유료']}
                imageUrl={p.imageUrl || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center'}
                onClick={() => handleProgramClick(p)}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <nav className="pagination" aria-label="페이지네이션">
            <button className="page nav" disabled={page <= 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>
              <span className="nav__arrow">‹</span>
            </button>

            {Array.from({ length: totalPages }).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3)).map((_, i) => {
              const first = Math.max(0, page - 2);
              const pageNum = first + i + 1;
              return (
                <button key={pageNum} className={`page ${pageNum === page ? 'active' : ''}`} onClick={() => setPage(pageNum)}>
                  {pageNum}
                </button>
              );
            })}

            <button className="page nav" disabled={page >= totalPages} onClick={() => setPage((v) => Math.min(totalPages, v + 1))}>
              <span className="nav__arrow">›</span>
            </button>
          </nav>
        )}
      </section>

    </div>
  );
}