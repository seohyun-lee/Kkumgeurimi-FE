import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INTEREST_GROUPS } from '../../config/constants';
import ProgramCard from "../../components/ProgramCard.jsx";
import './Explore.css';

const ALL_PROGRAMS = [
  { program_id: 1, title: 'AI 기초 프로그래밍 체험', provider: '테크 이노베이션 센터', program_type: '체험활동', venue_region: '서울', field_category: 'IT', target_audience: '고등학생', start_date: '2025-09-15', end_date: '2025-12-15', price: '무료', description: '인공지능의 기초 개념을 학습하고 간단한 AI 모델을 직접 구현해보는 프로그램입니다.', capacity: 30, avail_hours: '매주 토요일 14:00-17:00', venue: '강남구 테크센터', job_field: '개발자' },
  { program_id: 2, title: '창의 디자인 워크샵', provider: '크리에이티브 스튜디오', program_type: '워크샵', venue_region: '경기', field_category: '디자인', target_audience: '중학생, 고등학생', start_date: '2025-10-01', end_date: '2025-11-30', price: '50,000원', description: '디자인 씽킹을 바탕으로 창의적인 문제 해결 능력을 기르는 프로그램입니다.', capacity: 25, avail_hours: '매주 일요일 10:00-16:00', venue: '수원시 크리에이티브센터', job_field: '디자이너' },
  { program_id: 3, title: '로봇공학 체험교실', provider: '미래과학관', program_type: '실험체험', venue_region: '서울', field_category: '과학', target_audience: '중학생', start_date: '2025-09-20', end_date: '2025-12-20', price: '무료', description: '로봇의 원리를 이해하고 직접 조립하며 프로그래밍하는 체험 프로그램입니다.', capacity: 20, avail_hours: '매주 수요일 16:00-18:00', venue: '종로구 과학관', job_field: '연구원' },
  { program_id: 4, title: '디지털 아트 창작', provider: '아트테크 스쿨', program_type: '창작활동', venue_region: '부산', field_category: '예술', target_audience: '고등학생, 대학생', start_date: '2025-09-10', end_date: '2025-11-10', price: '80,000원', description: '최신 디지털 도구를 활용한 현대적인 아트워크 제작 프로그램입니다.', capacity: 15, avail_hours: '매주 금요일 19:00-22:00', venue: '해운대구 아트센터', job_field: '디자이너' },
  { program_id: 5, title: '바이오테크 실험실 체험', provider: '생명과학연구소', program_type: '실험체험', venue_region: '대구', field_category: '과학', target_audience: '고등학생', start_date: '2025-10-15', end_date: '2025-12-15', price: '무료', description: '최첨단 바이오 기술을 직접 경험하고 미래 생명과학의 가능성을 탐구합니다.', capacity: 18, avail_hours: '매주 토요일 09:00-12:00', venue: '수성구 바이오센터', job_field: '연구원' },
  { program_id: 6, title: '스포츠 심리학 워크샵', provider: '스포츠 심리연구원', program_type: '워크샵', venue_region: '서울', field_category: '체육', target_audience: '고등학생, 대학생', start_date: '2025-09-25', end_date: '2025-11-25', price: '60,000원', description: '운동선수들의 심리적 컨디션 관리와 멘탈 트레이닝 기법을 배웁니다.', capacity: 22, avail_hours: '매주 화요일 18:00-21:00', venue: '송파구 스포츠센터', job_field: '기획자' },
  { program_id: 7, title: '웹 개발 부트캠프', provider: '코딩 아카데미', program_type: '체험활동', venue_region: '서울', field_category: 'IT', target_audience: '대학생', start_date: '2025-08-20', end_date: '2025-10-20', price: '무료', description: '웹 개발의 전 과정을 체험하고 실제 웹사이트를 만들어보는 프로그램입니다.', capacity: 24, avail_hours: '매주 토요일 10:00-18:00', venue: '강남구 코딩센터', job_field: '개발자' },
  { program_id: 8, title: '패션 디자인 아틀리에', provider: '패션 크리에이터 센터', program_type: '창작활동', venue_region: '경기', field_category: '디자인', target_audience: '고등학생', start_date: '2025-09-05', end_date: '2025-11-05', price: '120,000원', description: '패션 디자인의 기초부터 실제 의상 제작까지 경험하는 창작 프로그램입니다.', capacity: 16, avail_hours: '매주 일요일 13:00-17:00', venue: '성남시 패션센터', job_field: '디자이너' }, ];

const VENUE_TYPE_CHIPS = [
  { value: "all", label: "전체" },
  { value: "public", label: "공공기관/공기업" },
  { value: "private", label: "민간기업" },
  { value: "civic", label: "청소년/시민단체" },
  { value: "school", label: "학교/대학교" },
  { value: "individual", label: "개인사업장" },
];
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
  venueType: 'all',
  job: 'all',
  type: 'all',
  cost: 'all',
  startDate: '2025-08-29',
  endDate: '2025-12-31',
};


function InfoItem({ k, v }) {
  return (
    <>
      <dt className="info-grid__key">{k}</dt>
      <dd className="info-grid__val">{v}</dd>
    </>
  );
}
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
    filters.venueType !== 'all' && {
      key: 'venueType',
      label: '체험처',
      value: labelByValue(VENUE_TYPE_CHIPS, filters.venueType),
    },
    filters.job !== 'all' && {
      key: 'job',
      label: '직무',
      value: labelByValue(
        [{ value: 'all', label: '전체' }, ...INTEREST_GROUPS.map(g => ({ value: g.key, label: g.label }))],
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
  const itemsPerPage = 6;


  // 카테고리 변경 시 URL 업데이트 + 페이지 리셋
  const handleChangeCategory = (cat) => {
    setFilters((f) => ({ ...f, category: cat }));
    setPage(1);
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('cat');
    else next.set('cat', cat);
    setSearchParams(next, { replace: true });
  };

  /** 필터링 */
  const filtered = useMemo(() => {
    const s = new Date(filters.startDate);
    const e = new Date(filters.endDate);
  
    return ALL_PROGRAMS.filter((p) => {
      const cat = filters.category === 'all' || p.field_category === filters.category;
      const job = filters.job === 'all' || p.job_field === filters.job; // 샘플 데이터와 키값이 다르면 이 조건은 항상 false 될 수 있음
      const typ = filters.type === 'all' || p.program_type === filters.type;
      const venueType = filters.venueType === 'all' || p.venue_type == null || p.venue_type === filters.venueType; 

      const cost =
        filters.cost === 'all' ||
        (filters.cost === 'free' && p.price === '무료') ||
        (filters.cost === 'paid' && p.price !== '무료');
  
      const dateOk = new Date(p.start_date) >= s && new Date(p.start_date) <= e;
      return cat && job && typ && venueType && cost && dateOk;
    });
  }, [filters]);
  

  /** 정렬 */
  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case 'latest':
        list.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        break;
      case 'popular':
        list.sort((a, b) => b.capacity - a.capacity);
        break;
      case 'deadline':
        list.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
        break;
      case 'free':
        list.sort((a, b) => (a.price === '무료' ? -1 : 1) - (b.price === '무료' ? -1 : 1));
        break;
      default:
        break;
    }
    return list;
  }, [filtered, sortBy]);

  /** 페이지네이션 */
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const pageData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [sorted, page]);

  /** 이벤트 */
  const applyFilters = () => setPage(1);
  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, category: 'all' });
    setPage(1);
    const next = new URLSearchParams(searchParams);
    next.delete('cat');
    setSearchParams(next, { replace: true });
  };
  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
            label="체험처"
            value={filters.venueType}
            onChange={(v) => setFilters((f) => ({ ...f, venueType: v }))}
            options={VENUE_TYPE_CHIPS}
          />
          <SelectFilter
            label="직무"
            value={filters.job}
            onChange={(v) => setFilters((f) => ({ ...f, job: v }))}
            options={[
              { value: 'all', label: '전체' },
              ...INTEREST_GROUPS.map(g => ({ value: g.key, label: g.label })),
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
            전체 <span className="results__count">{sorted.length}</span>개
          </div>
          <select className="sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="deadline">마감임박순</option>
            <option value="free">무료순</option>
          </select>
        </div>

        <div className="grid">
          {pageData.map((p) => (
            <ProgramCard
              key={p.program_id}
              program={p}
              isLiked={liked.has(p.program_id)}
              onLike={toggleLike}
              onClick={(program) => setModal({ open: true, program })}
            />
          ))}
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

      {modal.open && modal.program && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          onClick={(e) =>
            e.target.classList.contains("modal") &&
            setModal({ open: false, program: null })
          }
        >
          <div className="modal__panel">
            <div className="modal__header">
              <button
                className="modal__close"
                aria-label="닫기"
                onClick={() => setModal({ open: false, program: null })}
              >
                ×
              </button>
              <h2 className="modal__title">{modal.program.title}</h2>
              <div className="modal__provider">{modal.program.provider}</div>
            </div>

            {/* ✅ 여기만 스크롤 */}
            <div className="modal__content">
              {/* 1) 소개 먼저 */}
              <section className="section section--desc">
                <h3 className="section__title">프로그램 소개</h3>
                <p className="section__text">
                  {modal.program.description}
                </p>
              </section>

              {/* 태그/라벨 */}
              <section className="section section--tags">
                <div className="tags">
                  <span className="tag">{modal.program.field_category}</span>
                  {/*추후 태그로 등록할 것 추가*/}
                </div>
              </section>

              {/* 핵심 정보: 2열 그리드 (모바일 1→2열) */}
              <section className="section">
                <h3 className="section__title">핵심 정보</h3>
                <dl className="info-grid">
                  <InfoItem k="프로그램 유형" v={modal.program.program_type} />
                  <InfoItem k="대상" v={modal.program.target_audience} />
                  <InfoItem k="지역" v={modal.program.venue_region} />
                  <InfoItem k="참가비" v={modal.program.price} />
                  <InfoItem k="모집인원" v={`${modal.program.capacity}명`} />
                  <InfoItem k="운영시간" v={modal.program.avail_hours} />
                  <InfoItem k="장소" v={modal.program.venue} />
                  <InfoItem k="관련직무" v={modal.program.job_field} />
                  <InfoItem k="기간" v={`${modal.program.start_date} ~ ${modal.program.end_date}`} />
                  <InfoItem k="분야" v={modal.program.field_category} />
                </dl>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
