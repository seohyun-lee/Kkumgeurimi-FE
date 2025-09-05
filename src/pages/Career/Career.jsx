import React, { useState, useEffect } from 'react';
import { getMentorsForCareer } from '../../data/mentors.js';
import { careerService } from '../../services/career.service.js';
import { authService } from '../../services/auth.service.js';
import { getLabelByCode } from '../../config/constants.js';
import { useAuthStore } from '../../store/auth.store.js';
import './Career.css';

// 멘토와 관심사 매핑
const mapMentorToInterest = (mentorId) => {
  const mapping = {
    'frontend-developer': 'frontend',
    'ux-ui-designer': 'design', 
    'data-scientist': 'data',
    'marketing-specialist': 'marketing',
    'startup-founder': 'startup'
  };
  return mapping[mentorId] || 'frontend';
};

const Career = () => {
  const [currentState, setCurrentState] = useState('default');
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    interests: [],
    programs: [],
    mentors: []
  });
  
  const { isAuthenticated } = useAuthStore();

  // 목업 데이터로 버블 생성
  useEffect(() => {
    const loadCareerData = () => {
      try {
        setLoading(true);
        
        // 목업 버블 데이터 사용
        const mockBubbleData = {
          interests: [
            {
              id: 'frontend',
              categoryId: 'frontend',
              name: '프론트엔드',
              fullTitle: '프론트엔드 개발자',
              x: -80, 
              y: -60,
              size: 'large',
              color: '#A5B4FC',
              type: 'interest'
            },
            {
              id: 'design',
              categoryId: 'design', 
              name: '디자인',
              fullTitle: 'UX/UI 디자이너',
              x: 90,
              y: -40,
              size: 'medium',
              color: '#FDBA74',
              type: 'interest'
            },
            {
              id: 'data',
              categoryId: 'data',
              name: '데이터',
              fullTitle: '데이터 사이언티스트',
              x: -60,
              y: 80,
              size: 'medium', 
              color: '#93C5FD',
              type: 'interest'
            },
            {
              id: 'marketing',
              categoryId: 'marketing',
              name: '마케팅',
              fullTitle: '마케팅 전문가',
              x: 70,
              y: 90,
              size: 'small',
              color: '#F9A8D4',
              type: 'interest'
            },
            {
              id: 'startup',
              categoryId: 'startup',
              name: '창업',
              fullTitle: '창업가/기업가',
              x: 0,
              y: -100,
              size: 'small',
              color: '#86EFAC',
              type: 'interest'
            }
          ],
          programs: [
            {
              id: 'prog-1',
              name: 'React 부트캠프',
              parentId: 'frontend',
              x: -120,
              y: -20,
              size: 'small',
              color: '#C4B5FD',
              type: 'program'
            },
            {
              id: 'prog-2', 
              name: 'UI/UX 워크샵',
              parentId: 'design',
              x: 130,
              y: -10,
              size: 'small',
              color: '#FCD34D',
              type: 'program'
            },
            {
              id: 'prog-3',
              name: 'AI 데이터 분석',
              parentId: 'data',
              x: -90,
              y: 120,
              size: 'small', 
              color: '#7DD3FC',
              type: 'program'
            }
          ]
        };
        
        console.log("🎯 목업 버블 데이터:", mockBubbleData);
        
        // 멘토 데이터 추가 (목업 데이터 포함)
        const mentors = [
          ...getMentorsForCareer().map(mentor => ({
            ...mentor,
            interestId: mapMentorToInterest(mentor.id)
          })),
          // 목업 멘토 데이터 추가
          {
            id: 'frontend-dev-1',
            name: '김민준',
            description: '네이버에서 5년간 프론트엔드 개발을 담당하고 있습니다.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            interestId: 'frontend'
          },
          {
            id: 'ux-designer-1', 
            name: '박서연',
            description: '카카오에서 UX/UI 디자이너로 활동 중이며 사용자 중심 디자인을 추구합니다.',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            interestId: 'design'
          },
          {
            id: 'marketing-expert-1',
            name: '최지은',
            description: '토스에서 디지털 마케팅을 담당하며 그로스 해킹 전문가입니다.',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            interestId: 'marketing'
          },
          {
            id: 'startup-founder-1',
            name: '정태현',
            description: '3번의 창업 경험을 가진 시리얼 앙트레프레너로 스타트업 생태계를 이끌고 있습니다.',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            interestId: 'startup'
          }
        ];
        
        setData({
          interests: mockBubbleData.interests.map(interest => ({
            ...interest,
            title: generateJobTitle(interest.categoryId),
            description: generateJobDescription(interest.categoryId),
            background: `bg-category-${interest.categoryId}`
          })),
          programs: mockBubbleData.programs,
          mentors
        });
        
      } catch (error) {
        console.error("Career 데이터 로딩 실패:", error);
        // 에러 시에도 기본 목업 데이터 사용
        const mentors = [
          {
            id: 'frontend-dev-1',
            name: '김민준',
            description: '네이버에서 5년간 프론트엔드 개발을 담당하고 있습니다.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            interestId: 'frontend'
          }
        ];
        
        setData({ 
          interests: [
            {
              id: 'frontend',
              categoryId: 'frontend',
              name: '프론트엔드',
              title: '프론트엔드 개발자',
              description: generateJobDescription('frontend'),
              x: 0, y: 0, size: 'large', color: '#A5B4FC', type: 'interest'
            }
          ], 
          programs: [], 
          mentors 
        });
      } finally {
        setLoading(false);
      }
    };

    loadCareerData();
  }, [isAuthenticated]);

  // 카테고리 ID를 기반으로 직업 제목 생성
  const generateJobTitle = (categoryId) => {
    const jobTitles = {
      'frontend': '프론트엔드 개발자',
      'design': 'UX/UI 디자이너',
      'data': '데이터 사이언티스트',
      'marketing': '마케팅 전문가',
      'startup': '창업가/기업가'
    };
    return jobTitles[categoryId] || `${categoryId} 전문가`;
  };

  // 카테고리 ID를 기반으로 직업 설명 생성
  const generateJobDescription = (categoryId) => {
    const descriptions = {
      'frontend': `
        <h3>주요 업무</h3>
        <p>React, Vue.js 등 현대적인 프론트엔드 기술을 활용하여 사용자 인터페이스를 개발하고 웹 애플리케이션을 구축합니다.</p>
        <h3>필요 역량</h3>
        <p>JavaScript, HTML/CSS 능숙도, 프레임워크 활용능력, UI/UX 이해, 문제해결능력이 중요합니다.</p>
      `,
      'design': `
        <h3>주요 업무</h3>
        <p>사용자 경험과 인터페이스 디자인의 기본 원리를 바탕으로 직관적이고 아름다운 디지털 제품을 설계합니다.</p>
        <h3>필요 역량</h3>
        <p>디자인 툴 활용능력, 사용자 중심 사고, 창의성, 소통능력, 트렌드 감각이 필요합니다.</p>
      `,
      'data': `
        <h3>주요 업무</h3>
        <p>Python을 활용한 데이터 분석과 머신러닝 기법을 통해 비즈니스 인사이트를 도출하고 데이터 기반 의사결정을 지원합니다.</p>
        <h3>필요 역량</h3>
        <p>통계학 지식, 프로그래밍 능력, 분석적 사고, 도메인 지식, 커뮤니케이션 스킬이 중요합니다.</p>
      `,
      'marketing': `
        <h3>주요 업무</h3>
        <p>디지털 마케팅의 핵심 전략과 실행 방법을 통해 브랜드 인지도 향상과 고객 획득에 기여합니다.</p>
        <h3>필요 역량</h3>
        <p>마케팅 전략 수립능력, 데이터 분석능력, SNS 활용능력, 창의성, 트렌드 감각이 필요합니다.</p>
      `,
      'startup': `
        <h3>주요 업무</h3>
        <p>창업 아이디어를 발굴하고 시장 검증을 통해 사업화 가능성을 높이며 혁신적인 비즈니스를 구축합니다.</p>
        <h3>필요 역량</h3>
        <p>사업 기획력, 리더십, 위험 감수 능력, 네트워킹 능력, 끈기와 열정이 중요합니다.</p>
      `
    };
    return descriptions[categoryId] || `
      <h3>주요 업무</h3>
      <p>해당 분야의 전문적인 업무를 수행합니다.</p>
      <h3>필요 역량</h3>
      <p>전문지식과 실무능력이 필요합니다.</p>
    `;
  };

  const selectInterest = (interestId) => {
    const interest = data.interests.find(i => i.id === interestId);
    if (interest) {
      setSelectedInterest(interest);
      setCurrentState('detail');
    }
  };

  const resetToDefault = () => {
    setCurrentState('default');
    setSelectedInterest(null);
  };

  const renderBubbles = () => {
    const allBubbles = [...data.interests, ...data.programs];
    
    return allBubbles.map(bubble => {
      const isHidden = currentState === 'detail' && selectedInterest && 
        (bubble.id !== selectedInterest.id && bubble.parentId !== selectedInterest.id);
      
      const isSelected = currentState === 'detail' && selectedInterest && 
        (bubble.id === selectedInterest.id || bubble.parentId === selectedInterest.id);

      return (
        <div
          key={bubble.id}
          className={`interest-bubble bubble-${bubble.size} ${isHidden ? 'hidden' : ''} ${isSelected ? 'selected' : ''}`}
          style={{
            backgroundColor: bubble.color,
            left: `calc(50% + ${bubble.x}px - ${bubble.size === 'large' ? '75px' : bubble.size === 'medium' ? '50px' : '35px'})`,
            top: `calc(50% + ${bubble.y}px - ${bubble.size === 'large' ? '75px' : bubble.size === 'medium' ? '50px' : '35px'})`
          }}
          onClick={() => bubble.type === 'interest' && selectInterest(bubble.id)}
          title={bubble.fullTitle || bubble.name}
        >
          {bubble.name}
        </div>
      );
    });
  };

  const renderMentors = () => {
    if (!selectedInterest) return null;
    
    // selectedInterest의 categoryId나 id를 기반으로 매칭
    const categoryId = selectedInterest.categoryId || selectedInterest.id;
    console.log('🔍 멘토 필터링 정보:', { selectedInterest, categoryId, mentors: data.mentors });
    
    const mentors = data.mentors.filter(m => 
      m.interestId === categoryId || 
      m.interestId === selectedInterest.id ||
      m.interestId === selectedInterest.name?.toLowerCase()
    );
    
    console.log('🎯 필터링된 멘토들:', mentors);
    
    if (mentors.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          이 분야의 멘토가 아직 준비되지 않았습니다.
        </div>
      );
    }
    
    return mentors.map(mentor => (
      <div key={mentor.id} className="mentor-card">
        <div className="mentor-avatar">
          <img src={mentor.avatar} alt={mentor.name} />
        </div>
        <div className="mentor-info">
          <h4>{mentor.name}</h4>
          <p>{mentor.description}</p>
        </div>
        <button className="chat-btn">대화하기</button>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="career loading">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>진로맵을 생성하는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`career ${currentState === 'detail' ? 'detail-mode' : ''}`}>
      {currentState === 'detail' && (
        <button className="back-btn" onClick={resetToDefault}>←</button>
      )}
      
      <div className="container">
        <div className="header">
          {currentState === 'default' ? (
            <>
              <h1>나의 진로맵</h1>
              <p>나만의 관심사는</p>
              <h2>{data.interests.map(i => i.name).join(', ')}</h2>
            </>
          ) : (
            <h1>{selectedInterest?.name} 분야를 더 알아볼까요?</h1>
          )}
        </div>

        <div className="interest-map">
          {data.interests.length === 0 && data.programs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              아직 체험한 프로그램이 없습니다.
            </div>
          ) : (
            renderBubbles()
          )}
        </div>

        {currentState === 'detail' && selectedInterest && (
          <div className="detail-section active">
            <div className="job-info">
              <h2>{selectedInterest.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: selectedInterest.description }} />
            </div>

            <div className="mentor-section">
              <div className="mentor-header">
                <h3>AI 멘토와 대화하기</h3>
              </div>
              <div className="mentor-cards">
                {renderMentors()}
              </div>
            </div>
          </div>
        )}

        <div className="programs-section">
          <h2>
            {selectedInterest 
              ? `${selectedInterest.title} 관련 추천 프로그램`
              : '나에게 딱 맞는 추천 프로그램'
            }
          </h2>
          <div className="program-cards">
            <div className="program-card">
              <div className="program-icon" style={{ background: '#74b9ff' }}>🤖</div>
              <h3>AI 개발자 멘토링</h3>
              <p>AI 개발자가 어떻게 일하는지 멘토에게 직접 들어보세요</p>
            </div>
            <div className="program-card">
              <div className="program-icon" style={{ background: '#fd79a8' }}>🎨</div>
              <h3>프론트엔드 개발자 멘토링</h3>
              <p>프론트엔드 개발자가 어떻게 일하는지 배워요</p>
            </div>
            <div className="program-card">
              <div className="program-icon" style={{ background: '#fdcb6e' }}>📝</div>
              <h3>PM 직무 멘토링</h3>
              <p>프로덕트 매니저의 실무를 경험해보세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;