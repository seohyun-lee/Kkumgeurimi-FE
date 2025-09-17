import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { INTEREST_LABELS } from '../../config/constants';
import { programsService } from '../../services/programs.service.js';
import { useAuthStore } from '../../store/auth.store.js';
import ProgramCardBasic from "../../components/ProgramCardBasic.jsx";
import ProgramDetailModal from "../../components/ProgramDetailModal.jsx";
import { getCategoryName } from '../../utils/category.js';
import './Explore.css';

const PROGRAM_TYPE_CHIPS = [
  { value: "all", label: "전체" },
  { value: "0", label: "현장직업체험형" },
  { value: "1", label: "직업실무체험형" },
  { value: "2", label: "현장견학형" },
  { value: "3", label: "학과체험형" },
  { value: "4", label: "캠프형" },
  { value: "5", label: "강연형" },
  { value: "6", label: "대화형" },
];

const COST_TYPE_CHIPS = [
  { value: "all", label: "전체" },
  { value: "FREE", label: "무료" },
  { value: "PAID", label: "유료" },
];

const INTEREST_CATEGORY_CHIPS = [
  { value: "all", label: "전체" },
  { value: "0", label: "인문사회" },
  { value: "1", label: "자연생명" },
  { value: "2", label: "정보통신" },
  { value: "3", label: "건설채굴" },
  { value: "4", label: "제조공학" },
  { value: "5", label: "사회복지" },
  { value: "6", label: "교육" },
  { value: "7", label: "법률" },
  { value: "8", label: "경찰소방" },
  { value: "9", label: "군인" },
  { value: "10", label: "보건의료" },
  { value: "11", label: "예술디자인" },
  { value: "12", label: "스포츠" },
  { value: "13", label: "경호경비" },
  { value: "14", label: "돌봄서비스" },
  { value: "15", label: "청소서비스" },
  { value: "16", label: "미용예식" },
  { value: "17", label: "여행숙박" },
  { value: "18", label: "음식서비스" },
  { value: "19", label: "영업판매" },
  { value: "20", label: "운전운송" },
  { value: "21", label: "건설채굴" },
  { value: "22", label: "식품가공" },
  { value: "23", label: "인쇄목재" },
  { value: "24", label: "제조단순" },
  { value: "25", label: "기계정비" },
  { value: "26", label: "금속재료" },
  { value: "27", label: "전기전자" },
  { value: "28", label: "정보통신" },
  { value: "29", label: "화학환경" },
  { value: "30", label: "섬유의복" },
  { value: "31", label: "농림어업" },
];

const TARGET_AUDIENCE_CHIPS = [
  { value: "all", label: "전체" },
  { value: "중학생", label: "중학생" },
  { value: "고등학생", label: "고등학생" }
];

// 현재 날짜를 동적으로 설정
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; 
};

const getEndDate = () => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 4); // 4개월 후
  return endDate.toISOString().split('T')[0];
};

const DEFAULT_FILTERS = {
  interestCategory: 'all',
  programType: 'all',
  costType: 'all',
  startDate: getCurrentDate(),
  endDate: getEndDate(),
  targetAudience: 'all',
  keyword: ''
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
  const labelByValue = (options, v) =>
    options.find(o => o.value === v)?.label ?? v;

  const entries = [
    filters.interestCategory !== 'all' && {
      key: 'interestCategory',
      label: '관심분야',
      value: labelByValue(INTEREST_CATEGORY_CHIPS, filters.interestCategory),
    },
    filters.programType !== 'all' && {
      key: 'programType',
      label: '프로그램유형',
      value: labelByValue(PROGRAM_TYPE_CHIPS, filters.programType),
    },
    filters.costType !== 'all' && {
      key: 'costType',
      label: '비용',
      value: labelByValue(COST_TYPE_CHIPS, filters.costType),
    },
    filters.targetAudience !== 'all' && {
      key: 'targetAudience',
      label: '대상',
      value: labelByValue(TARGET_AUDIENCE_CHIPS, filters.targetAudience),
    },
    filters.keyword && {
      key: 'keyword',
      label: '키워드',
      value: filters.keyword,
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

  const initialCat = searchParams.get('cat') || 'all';

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    interestCategory: initialCat,
  });

  const [sortBy, setSortBy] = useState('LATEST');
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [likedPrograms, setLikedPrograms] = useState(new Set());

  const { data: likedProgramsData } = useQuery({
    queryKey: ['liked-programs'],
    queryFn: programsService.getLikedPrograms,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (likedProgramsData && Array.isArray(likedProgramsData)) {
      const likedIds = new Set(likedProgramsData.map(program => program.programId || program.program_id || program.id));
      setLikedPrograms(likedIds);
    }
  }, [likedProgramsData]);

  const [programs, setPrograms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const handleChangeCategory = (cat) => {
    setFilters((f) => ({ ...f, interestCategory: cat }));
    setPage(0);
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('cat');
    else next.set('cat', cat);
    setSearchParams(next, { replace: true });
  };

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await programsService.searchPrograms({
        interestCategory: filters.interestCategory,
        programType: filters.programType,
        costType: filters.costType,
        startDate: filters.startDate,
        endDate: filters.endDate,
        targetAudience: filters.targetAudience === 'all' ? undefined : filters.targetAudience,
        keyword: filters.keyword,
        sortBy,
        page,
        size: itemsPerPage
      });
      
      setPrograms(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
      
      // 백엔드는 1-based 페이징을 사용하므로 프론트엔드는 0-based로 변환
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
  };
  
  // 검색 버튼을 눌렀을 때만 API 호출
  const applyFilters = () => {
    setPage(0);
    fetchPrograms();
  };

  // 초기 로드 시 검색
  useEffect(() => {
    fetchPrograms();
  }, []);

  // 페이지 변경 시에만 API 호출
  useEffect(() => {
    if (page > 0) {
      fetchPrograms();
    }
  }, [page]);
  
  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, interestCategory: 'all', targetAudience: 'all' });
    setPage(0);
    const next = new URLSearchParams(searchParams);
    next.delete('cat');
    setSearchParams(next, { replace: true });
    fetchPrograms(); // 리셋 후 바로 검색
  };

  const handleProgramClick = (program) => {
    const transformedProgram = {
      programId: program.programId,
      programTitle: program.programTitle,
      provider: program.provider,
      objective: '프로그램 목표 설명',
      targetAudience: '중고등학생',
      programType: 1,
      startDate: program.startDate,
      endDate: program.endDate,
      relatedMajor: program.interestCategoryLabel,
      costType: program.costType,
      price: program.costType === 'PAID' ? '가격 문의' : null,
      imageUrl: program.imageUrl,
      eligibleRegion: '전국',
      venueRegion: program.venueRegion,
      operateCycle: '주 1회',
      interestCategory: 18,
      programDetail: {
        programDetailId: `detail-${program.programId}`,
        description: '프로그램 상세 설명입니다.',
        requiredHours: '총 6시간',
        availHours: '주말 오후',
        capacity: 20,
        targetSchoolType: '중학교, 고등학교',
        levelInfo: '중학생, 고등학생'
      },
      tags: [program.programTypeLabel, program.costType === 'FREE' ? '무료' : '유료']
    };
    setSelectedProgram(transformedProgram);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  const handleLikeProgram = async (program) => {
    try {
      if (likedPrograms.has(program.programId)) {
        await programsService.unlikeProgram(program.programId);
        setLikedPrograms(prev => {
          const newSet = new Set(prev);
          newSet.delete(program.programId);
          return newSet;
        });
      } else {
        await programsService.likeProgram(program.programId);
        setLikedPrograms(prev => {
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

      <div className="filters filters--compact">
        <div className="filters__row">
            <label className="selectfilter">
              <span className="selectfilter__label">키워드</span>
              <input
                type="text"
                className="selectfilter__input"
                placeholder="프로그램명 검색"
                value={filters.keyword}
                onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
              />
            </label>
            
          <SelectFilter
              label="관심분야"
              value={filters.interestCategory}
              onChange={(v) => setFilters((f) => ({ ...f, interestCategory: v }))}
              options={INTEREST_CATEGORY_CHIPS}
            />
            
          <SelectFilter
              label="프로그램유형"
              value={filters.programType}
              onChange={(v) => setFilters((f) => ({ ...f, programType: v }))}
              options={PROGRAM_TYPE_CHIPS}
            />
            
          <SelectFilter
            label="비용"
              value={filters.costType}
              onChange={(v) => setFilters((f) => ({ ...f, costType: v }))}
              options={COST_TYPE_CHIPS}
            />
            
            <SelectFilter
              label="대상"
              value={filters.targetAudience}
              onChange={(v) => setFilters((f) => ({ ...f, targetAudience: v }))}
              options={TARGET_AUDIENCE_CHIPS}
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

        <SelectedFilters
          filters={filters}
            onClearKey={(key) => {
              if (key === 'date') {
                setFilters(f => ({ ...f, startDate: DEFAULT_FILTERS.startDate, endDate: DEFAULT_FILTERS.endDate }));
              } else if (key === 'keyword') {
                setFilters(f => ({ ...f, [key]: '' }));
              } else {
                setFilters(f => ({ ...f, [key]: 'all' }));
              }
              setPage(0);
            }}
          onReset={resetFilters}
        />
      </div>
    </header>

      <section className="explore__content">
        <div className="content__top">
          <div className="results">
            {loading ? '검색 중...' : `전체 ${totalElements}개`}
          </div>
          <select className="sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); fetchPrograms(); }}>
            <option value="LATEST">최신순</option>
            <option value="POPULAR">인기순</option>
            <option value="DEADLINE">마감임박순</option>
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
                key={p.programId}
                title={p.programTitle}
                organization={p.provider}
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
            <button className="page nav" disabled={page <= 0} onClick={() => setPage((v) => Math.max(0, v - 1))}>
              <span className="nav__arrow">‹</span>
            </button>
          
            {Array.from({ length: totalPages }).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3)).map((_, i) => {
              const first = Math.max(0, page - 2);
              const pageNum = first + i;
              const displayNum = pageNum + 1;
              return (
                <button key={pageNum} className={`page ${pageNum === page ? 'active' : ''}`} onClick={() => setPage(pageNum)}>
                  {displayNum}
                </button>
              );
            })}
          
            <button className="page nav" disabled={page >= totalPages - 1} onClick={() => setPage((v) => Math.min(totalPages - 1, v + 1))}>
              <span className="nav__arrow">›</span>
            </button>
          </nav>
        )}
      </section>

      <ProgramDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        program={selectedProgram}
        onLike={handleLikeProgram}
        onApply={handleApplyProgram}
        isLiked={selectedProgram ? likedPrograms.has(selectedProgram.programId) : false}
      />
    </div>
  );
}

