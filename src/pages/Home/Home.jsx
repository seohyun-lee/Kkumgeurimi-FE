import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { programsService } from '../../services/programs.service.js';
import { useAuthStore } from '../../store/auth.store.js';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const [activeGradeTab, setActiveGradeTab] = useState('중1-2');

  // 다가오는 프로그램 조회
  const { data: upcomingPrograms, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['upcoming-programs'],
    queryFn: programsService.getUpcoming,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 개인화 추천 프로그램 조회 (로그인한 경우만)
  const { data: recommendedPrograms, isLoading: isLoadingRecommended } = useQuery({
    queryKey: ['recommended-programs'],
    queryFn: programsService.getRecommendations,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
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
  const upcomingProgramsArray = getProgramsArray(upcomingPrograms);
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

  // 인기 프로그램 목업 데이터
  const popularPrograms = [
    { 
      id: 1,
      icon: '🌿',
      title: '천연 방향제 만들기',
      description: '에센셜 오일과 안전한 재료로 나만의 향을 조합해 방향제를 만들어요',
      duration: '90분',
      level: '쉬워요',
      isHot: true,
      company: '청소년과학관',
      participants: 328,
      rating: 4.9
    },
    { 
      id: 2,
      icon: '🎮',
      title: '게임개발 첫걸음',
      description: '블록 코딩으로 캐릭터를 움직이고, 간단한 나만의 게임을 완성해요',
      duration: '120분',
      level: '도전해요',
      isHot: true,
      company: '인디게임랩',
      participants: 241,
      rating: 4.8
    },
    { 
      id: 3,
      icon: '🎬',
      title: '영화감독 체험',
      description: '짧은 이야기로 촬영·연출·편집까지, 한 편의 미니 영화 만들기',
      duration: '100분',
      level: '도전해요',
      isHot: false,
      company: '영화창작스튜디오',
      participants: 167,
      rating: 4.7
    },
    { 
      id: 4,
      icon: '🤖',
      title: '로봇공학자 체험',
      description: '센서로 반응하는 로봇을 조립하고 간단한 코딩으로 미션 수행',
      duration: '120분',
      level: '심화',
      isHot: true,
      company: '메이커스페이스',
      participants: 193,
      rating: 4.8
    }
  ];

  // 성공 스토리 목업 데이터 (학년대 중심 장려 톤)
  const successStories = [
    { 
      id: 1,
      avatar: '아', 
      name: '아린', 
      grade: '초6',
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
  const [currentSlide, setCurrentSlide] = useState(0);

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
    alert(`${program.title} 프로그램 상세 페이지로 이동합니다!`);
  };

  const nextSlide = () => {
    const maxSlide = Math.max(0, upcomingProgramsArray.length - 1);
    setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlide = Math.max(0, upcomingProgramsArray.length - 1);
    setCurrentSlide(prev => (prev <= 0 ? maxSlide : prev - 1));
  };

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
      {/* Featured Program Section */}
      <div className="home__featured-section">
        <div className="home__featured-card">
          <div className="home__featured-badge">추천 프로그램</div>
          <h2 className="home__featured-title">3D 그래픽 디자인 배우기</h2>
          <p className="home__featured-date">2025.08.10 (일) 오후 14-16시</p>
          <div className="home__pagination-dots">
            <div className="home__dot active"></div>
            <div className="home__dot"></div>
            <div className="home__dot"></div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="home__progress-section">
        <div className="home__progress-header">
          <div className="home__progress-title">나의 진로 탐색 여정</div>
          <div className="progress-percentage">25%</div>
        </div>
        <div className="home__progress-steps">
          <div className="home__progress-step completed">
            <div className="home__progress-step-circle active">✓</div>
            <div className="home__progress-step-text">흥미 탐색</div>
          </div>
          <div className="home__progress-step">
            <div className="home__progress-step-circle">2</div>
            <div className="home__progress-step-text">직업 체험</div>
          </div>
          <div className="home__progress-step">
            <div className="home__progress-step-circle">3</div>
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
          <a href="#" className="home__section-more">더보기 &gt;</a>
        </div>
        
        <div className="popular-programs-grid">
          {popularPrograms.map((program) => (
            <div 
              key={program.id} 
              className="popular-program-card"
              onClick={() => handleProgramClick(program.title)}
            >
              <div className="home__program-image">
                <div className="home__category-tag">카테고리</div>
              </div>
              <div className="home__program-info">
                <h4 className="program-title">{program.title}</h4>
                <p className="program-subtitle">{program.company}</p>
                <p className="program-date">2025-08-06 ~ 2025-12-31</p>
                <div className="home__program-tags">
                  <span className="tag">{program.level}</span>
                  <span className="tag free">무료</span>
                </div>
              </div>
            </div>
          ))}
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
          <a href="#" className="home__section-more">더보기 &gt;</a>
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
