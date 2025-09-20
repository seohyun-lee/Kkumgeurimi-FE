import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { programsService } from '../../services/programs.service.js';
import { useAuthStore } from '../../store/auth.store.js';
import ProgramCardBasic from '../../components/ProgramCardBasic.jsx';
import { useProgramModal } from '../../contexts/ProgramModalContext.jsx';
import { getCategoryName } from '../../utils/category.js';
import showAllIcon from '../../assets/icons/showall.svg';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const [activeGradeTab, setActiveGradeTab] = useState('중1-2');
  const { openModal } = useProgramModal();
  const navigate = useNavigate();


  // 개인화 추천 프로그램 조회 (로그인한 경우만)
  const { data: recommendedPrograms, isLoading: isLoadingRecommended } = useQuery({
    queryKey: ['recommended-programs'],
    queryFn: programsService.getRecommendations,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 이번 주 인기 프로그램 조회
  const { data: trendingPrograms, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trending-programs'],
    queryFn: () => programsService.getTrendingPrograms(4),
    staleTime: 10 * 60 * 1000, // 10분
  });

  // 데이터가 배열인지 확인하는 헬퍼 함수
  const isArray = (data) => Array.isArray(data);
  
  // 안전하게 배열 데이터 추출
  const getProgramsArray = (data) => {
    if (!data) return [];
    if (isArray(data)) return data;
    if (data.programs && isArray(data.programs)) return data.programs;
    if (data.data && isArray(data.data)) return data.data;
    return [];
  };

  // 실제 프로그램 데이터 배열
  const recommendedProgramsArray = getProgramsArray(recommendedPrograms);

  // 학년별 추천 콘텐츠
  const gradeContents = {
    '중1-2': [
      { icon: '🔬', title: '과학실험 체험', desc: '화학·물리 실험을 통한 과학 원리 이해', category: '과학기술' },
      { icon: '🎨', title: '디지털 아트', desc: 'Procreate로 창작하는 디지털 미술', category: '예술' },
      { icon: '🎮', title: '게임 제작 입문', desc: 'Scratch로 나만의 게임 만들기', category: 'IT' },
      { icon: '🎭', title: '연극·뮤지컬', desc: '연기, 노래, 춤을 통한 무대 예술 체험', category: '공연예술' }
    ],
    '중3-고1': [
      { icon: '📺', title: '방송 PD 체험', desc: '기획부터 촬영까지 방송 제작 전 과정', category: '미디어' },
      { icon: '⚖️', title: '모의재판 체험', desc: '검사, 변호사, 판사 역할을 통한 법조인 체험', category: '법률' },
      { icon: '🧬', title: '바이오 연구원', desc: 'DNA 추출과 세포 관찰 실험', category: '생명과학' },
      { icon: '📊', title: '마케팅 전략가', desc: '브랜드 분석과 마케팅 캠페인 기획', category: '마케팅' }
    ],
    '고1-고2': [
      { icon: '🌍', title: '외교관 체험', desc: '국제회의 시뮬레이션과 협상 전략', category: '국제' },
      { icon: '🎓', title: '대학 연구실 체험', desc: '교수님과 함께하는 실제 연구 프로젝트', category: '학술' },
      { icon: '📱', title: '앱개발 프로젝트', desc: 'Flutter로 실제 출시 가능한 앱 개발', category: 'IT' },
      { icon: '🎬', title: '영상제작 스튜디오', desc: '기획·촬영·편집·배급까지 영상 제작 전 과정', category: '미디어' }
    ]
  };

  // Featured 프로그램 목업 데이터
  const featuredPrograms = [
    {
      id: 1,
      title: '3D 그래픽 디자인 배우기',
      description: '블렌더와 Maya를 활용한 3D 모델링과 애니메이션 기초부터 심화까지',
      date: '2025.08.10 (일) 오후 14-16시',
      badge: '추천 프로그램',
      category: '디자인',
      isNew: true
    },
    {
      id: 2,
      title: 'AI 프로그래밍 입문',
      description: 'Python과 TensorFlow로 시작하는 인공지능 개발 첫걸음',
      date: '2025.08.15 (금) 오후 15-17시',
      badge: '인기 프로그램',
      category: 'IT',
      isNew: false
    },
    {
      id: 3,
      title: '웹툰 작가 체험',
      description: '디지털 드로잉부터 스토리텔링까지 웹툰 제작 전 과정',
      date: '2025.08.20 (수) 오후 14-16시',
      badge: '신규 프로그램',
      category: '예술',
      isNew: true
    },
    {
      id: 4,
      title: '유튜버 크리에이터',
      description: '영상 기획부터 편집, 채널 운영까지 크리에이터 되기',
      date: '2025.08.25 (월) 오후 16-18시',
      badge: 'HOT 프로그램',
      category: '미디어',
      isNew: false
    }
  ];

  // 인기 프로그램 목업 데이터 (기획자 꿈나무를 위한 프로그램)
  const popularPrograms = [
    {
      programId: "home-prog-001",
      programTitle: "서비스 기획자 직무 체험",
      provider: "네이버 커넥트재단",
      objective: "실제 서비스 기획 프로세스를 체험하고 사용자 니즈 분석부터 기획서 작성까지",
      targetAudience: "중고등학생",
      programType: 1,
      startDate: "2025-08-06",
      endDate: "2025-12-31",
      relatedMajor: "경영학",
      costType: "FREE",
      price: null,
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center",
      eligibleRegion: "전국",
      venueRegion: "네이버 본사",
      operateCycle: "월 2회",
      interestCategory: 18, // 서비스업
      programDetail: {
        programDetailId: "home-detail-001",
        description: "현직 서비스 기획자와 함께 실제 앱 서비스를 기획해보는 체험형 프로그램입니다.",
        requiredHours: "총 6시간",
        availHours: "토요일 오전 10시-오후 4시",
        capacity: 15,
        targetSchoolType: "중학교, 고등학교",
        levelInfo: "중학생, 고등학생"
      },
      tags: ["체험처", "무료"]
    },
    {
      programId: "home-prog-002",
      programTitle: "마케팅 전략 수립 워크샵",
      provider: "카카오 임팩트",
      objective: "브랜드 분석부터 캠페인 기획까지, 마케팅의 전 과정을 경험해보세요",
      targetAudience: "중고등학생",
      programType: 1,
      startDate: "2025-08-10",
      endDate: "2025-12-31",
      relatedMajor: "마케팅학",
      costType: "PAID",
      price: "30,000원",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center",
      eligibleRegion: "서울, 경기",
      venueRegion: "카카오 판교오피스",
      operateCycle: "주 1회",
      interestCategory: 18, // 서비스업
      programDetail: {
        programDetailId: "home-detail-002",
        description: "실제 브랜드 사례를 분석하고 마케팅 캠페인을 직접 기획해보는 실무형 프로그램입니다.",
        requiredHours: "총 4시간",
        availHours: "일요일 오후 1-5시",
        capacity: 20,
        targetSchoolType: "중학교, 고등학교",
        levelInfo: "중학생, 고등학생"
      },
      tags: ["체험처", "유료"]
    },
    {
      programId: "home-prog-003",
      programTitle: "스타트업 창업 기획 체험",
      provider: "D.CAMP",
      objective: "아이디어 발굴부터 비즈니스 모델 설계까지, 창업 기획의 A to Z",
      targetAudience: "중고등학생",
      programType: 1,
      startDate: "2025-08-15",
      endDate: "2025-12-31",
      relatedMajor: "창업학",
      costType: "FREE",
      price: null,
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop&crop=center",
      eligibleRegion: "전국",
      venueRegion: "D.CAMP 강남",
      operateCycle: "월 1회",
      interestCategory: 18, // 서비스업
      programDetail: {
        programDetailId: "home-detail-003",
        description: "실제 창업가들과 함께 아이디어를 구체화하고 사업 계획을 세워보는 프로그램입니다.",
        requiredHours: "총 8시간",
        availHours: "토요일 오전 9시-오후 5시",
        capacity: 12,
        targetSchoolType: "고등학교",
        levelInfo: "고등학생"
      },
      tags: ["체험처", "무료"]
    },
    {
      programId: "home-prog-004",
      programTitle: "UX/UI 기획 온라인 부트캠프",
      provider: "디자인컴퍼니",
      objective: "사용자 경험 설계와 인터페이스 기획을 통해 디지털 서비스 기획 역량 키우기",
      targetAudience: "중고등학생",
      programType: 2,
      startDate: "2025-08-20",
      endDate: "2025-12-31",
      relatedMajor: "디자인학",
      costType: "PAID",
      price: "50,000원",
      imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop&crop=center",
      eligibleRegion: "전국",
      venueRegion: "온라인 진행",
      operateCycle: "주 2회",
      interestCategory: 11, // 예술디자인
      programDetail: {
        programDetailId: "home-detail-004",
        description: "디자인 씽킹부터 프로토타이핑까지, UX/UI 기획의 전 과정을 온라인으로 학습합니다.",
        requiredHours: "총 12시간",
        availHours: "화요일, 목요일 오후 7-10시",
        capacity: 25,
        targetSchoolType: "중학교, 고등학교",
        levelInfo: "중학생, 고등학생"
      },
      tags: ["온라인", "유료"]
    }
  ];

  // 성공 스토리 목업 데이터 (학년대 중심 장려 톤)
  const successStories = [
    { 
      id: 1,
      avatar: '아', 
      name: '오즈짱', 
      grade: '중2',
      story: 'DNA 실험이 너무 신기해서 과학 일기를 쓰기 시작했어요. 다음엔 실험 동아리에도 참여해 보려고요!',
      program: 'DNA 화학 과학실험'
    },
    { 
      id: 2, 
      avatar: '민', 
      name: '민재', 
      grade: '중2',
      story: '게임개발 수업 후 친구들과 미니 게임을 만들어 학급에서 공개했어요. 코딩이 훨씬 친근해졌어요.',
      program: '게임개발 첫걸음'
    },
    { 
      id: 3, 
      avatar: '현', 
      name: '현우', 
      grade: '고1',
      story: '메이커 로봇 체험이 재미있어서 축제에서 로봇 게임 부스를 운영했어요. 전자·공학 쪽이 점점 궁금해져요!',
      program: '메이커 로봇 체험'
    }
  ];

  // 찜 상태 관리 (프로그램용)
  const [likedPrograms, setLikedPrograms] = useState(new Set());
  const [currentFeaturedSlide, setCurrentFeaturedSlide] = useState(0);

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
      setLikedPrograms(likedIds);
    }
  }, [likedProgramsData]);
  
  const toggleProgramLike = async (programId) => {
    try {
      const isCurrentlyLiked = likedPrograms.has(programId);
      
      if (isCurrentlyLiked) {
        await programsService.unlikeProgram(programId);
      } else {
        await programsService.likeProgram(programId);
      }
      
      // API 성공 시 UI 업데이트
      setLikedPrograms(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.delete(programId);
        } else {
          newSet.add(programId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('프로그램 찜하기 실패:', error);
      // TODO: 사용자에게 에러 메시지 표시
    }
  };

  const handleProgramClick = (program) => {
    openModal(program.programId);
  };

  const handleLikeProgram = async (program) => {
    try {
      if (likedPrograms.has(program.id)) {
        await programsService.unlikeProgram(program.id);
        setLikedPrograms(prev => {
          const newSet = new Set(prev);
          newSet.delete(program.id);
          return newSet;
        });
      } else {
        await programsService.likeProgram(program.id);
        setLikedPrograms(prev => {
          const newSet = new Set(prev);
          newSet.add(program.id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('프로그램 찜하기 실패:', error);
      // TODO: 사용자에게 에러 메시지 표시
    }
  };

  const handleApplyProgram = (program) => {
    alert(`${program.programTitle} 프로그램에 신청합니다!`);
    handleCloseModal();
  };

  // Featured program carousel 네비게이션
  const nextFeaturedSlide = () => {
    setCurrentFeaturedSlide(prev => 
      prev >= featuredPrograms.length - 1 ? 0 : prev + 1
    );
  };

  const prevFeaturedSlide = () => {
    setCurrentFeaturedSlide(prev => 
      prev <= 0 ? featuredPrograms.length - 1 : prev - 1
    );
  };

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedSlide(prev => 
        prev >= featuredPrograms.length - 1 ? 0 : prev + 1
      );
    }, 5000); // 5초마다 자동 슬라이드

    return () => clearInterval(interval);
  }, []);


  // 찜 상태 관리 (추천 콘텐츠용)
  const [wishlist, setWishlist] = useState(new Set());
  
  const toggleWishlist = async (itemId) => {
    try {
      const isCurrentlyLiked = wishlist.has(itemId);
      
      // 실제 프로그램 ID가 있는 경우만 API 호출
      // 학년별 콘텐츠 같은 경우는 로컬 상태만 관리
      if (typeof itemId === 'number' || (typeof itemId === 'string' && !itemId.startsWith('grade-'))) {
        if (isCurrentlyLiked) {
          await programsService.unlikeProgram(itemId);
        } else {
          await programsService.likeProgram(itemId);
        }
      }
      
    } catch (error) {
      console.error('찜하기 실패:', error);
      // TODO: 사용자에게 에러 메시지 표시
    }
  };

  const renderProgramCard = (program) => (
    <div key={program.id} className="recommendation-card">
      <div className="recommendation-icon">🎯</div>
      <h4 className="recommendation-title">{program.title}</h4>
      <p className="recommendation-description">{program.description}</p>
      <div className="recommendation-meta">
        <span className="duration">{program.duration}</span>
        <span className="level">{program.level}</span>
      </div>
    </div>
  );


  return (
    <div className="home">
      {/* Featured Program Carousel */}
      <div className="home__featured-section">
        <div className="home__featured-carousel">
          <div 
            className="home__featured-track"
            style={{ transform: `translateX(-${currentFeaturedSlide * 100}%)` }}
          >
            {featuredPrograms.map(program => (
              <div key={program.id} className="home__featured-slide">
                <div className="home__featured-card">
                  <div className="home__featured-badge">{program.badge}</div>
                  {program.isNew && <div className="home__new-badge">NEW</div>}
                  <h2 className="home__featured-title">{program.title}</h2>
                  <p className="home__featured-description">{program.description}</p>
                  <p className="home__featured-date">{program.date}</p>
                  <div className="home__featured-category">{program.category}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <button 
            className="home__featured-nav home__featured-nav--prev" 
            onClick={prevFeaturedSlide}
          >
            ‹
          </button>
          <button 
            className="home__featured-nav home__featured-nav--next" 
            onClick={nextFeaturedSlide}
          >
            ›
          </button>
          
          {/* Pagination Dots */}
          <div className="home__pagination-dots">
            {featuredPrograms.map((_, index) => (
              <button
                key={index}
                className={`home__dot ${index === currentFeaturedSlide ? 'active' : ''}`}
                onClick={() => setCurrentFeaturedSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="home__progress-section">
        <div className="home__progress-header">
          <div className="home__progress-title">나의 진로 탐색 여정</div>
          <div className="progress-percentage">75%</div>
        </div>
        <div className="home__progress-steps">
          <div className="home__progress-step completed">
            <div className="home__progress-step-circle active">✓</div>
            <div className="home__progress-step-text">흥미 탐색</div>
          </div>
          <div className="home__progress-step completed">
            <div className="home__progress-step-circle active">✓</div>
            <div className="home__progress-step-text">직업 체험</div>
          </div>
          <div className="home__progress-step completed">
            <div className="home__progress-step-circle active">✓</div>
            <div className="home__progress-step-text">적성 파악</div>
          </div>
          <div className="home__progress-step">
            <div className="home__progress-step-circle">4</div>
            <div className="home__progress-step-text">진로 설계</div>
          </div>
        </div>
      </div>


      {/* 인기 프로그램 섹션 */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">이번 주 인기 프로그램</h2>
          <span 
            className="home__section-more"
            onClick={() => navigate('/explore')}
            style={{ cursor: 'pointer' }}
          >
            더보기
            <img src={showAllIcon} alt="더보기" style={{ marginLeft: '4px', width: '10px', height: '10px' }} />
          </span>
        </div>
        
        <div className="popular-programs-grid">
          {isLoadingTrending ? (
            // 로딩 상태
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="program-card-basic loading">
                <div className="program-card-basic__image">
                  <div className="program-card-basic__placeholder loading-skeleton"></div>
                </div>
                <div className="program-card-basic__content">
                  <div className="loading-skeleton" style={{ height: '20px', marginBottom: '8px' }}></div>
                  <div className="loading-skeleton" style={{ height: '16px', marginBottom: '8px' }}></div>
                  <div className="loading-skeleton" style={{ height: '14px', marginBottom: '8px' }}></div>
                </div>
              </div>
            ))
          ) : (
            // 실제 데이터
            trendingPrograms?.slice(0, 4).map((program) => (
              <ProgramCardBasic
                key={program.programId}
                title={program.programTitle}
                organization={program.provider}
                date={`${program.startDate} ~ ${program.endDate}`}
                category={program.interestCategoryLabel || getCategoryName(program.interestCategory)}
                tags={[
                  program.programTypeLabel,
                  program.costType === 'FREE' ? '무료' : '유료'
                ]}
                imageUrl={program.imageUrl}
                onClick={() => handleProgramClick(program)}
              />
            ))
          )}
        </div>
      </section>

      {/* // 진로 적성 검사 섹션
      {
      <div className="home__aptitude-test">
        <div className="aptitude-content">
          <div className="aptitude-icon">🧠</div>
          <div className="aptitude-text">
            <h3>AI 기반 진로 적성 검사</h3>
            <p>5분 만에 나만의 맞춤 진로를 추천받아보세요</p>
            <div className="test-features">
              <span className="feature">✓ 16가지 성격 유형 분석</span>
              <span className="feature">✓ 300개 직업군 매칭</span>
              <span className="feature">✓ 개인별 로드맵 제공</span>
            </div>
          </div>
        </div>
        <button className="aptitude-btn" onClick={handleQuickCheck}>
          <span>무료 검사 시작하기</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
     }
     */
     }

      {/* 성공 스토리 섹션 */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">커뮤니티 인기글</h2>
          <span className="home__section-more">
            더보기
            <img src={showAllIcon} alt="더보기" style={{ marginLeft: '4px', width: '10px', height: '10px' }} />
          </span>
        </div>
        
        <div className="home__success-stories">
          <div className="home__story-cards">
            {successStories.map(story => (
              <div key={story.id} className="home__story-card">
                <div className="story-header">
                  <div className="home__story-profile">
                    <div className="home__story-avatar">{story.avatar}</div>
                    <div className="story-info">
                      <div className="home__story-name">{story.name}</div>
                      <div className="story-grade">{story.grade}</div>
                    </div>
                  </div>
                  <div className="story-program">{story.program}</div>
                </div>
                <div className="home__story-text">"{story.story}"</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
