import React, { useState, useEffect } from 'react';
import { getMentorsForCareer } from '../../data/mentors.js';
import { careerService } from '../../services/career.service.js';
import { authService } from '../../services/auth.service.js';
import { getLabelByCode } from '../../config/constants.js';
import { useAuthStore } from '../../store/auth.store.js';
import ProgramCardBasic from '../../components/ProgramCardBasic.jsx';
import showAllIcon from '../../assets/icons/showall.svg';
import './Career.css';

// 멘토와 관심사 매핑
const mapMentorToInterest = (mentorId) => {
  const mapping = {
    'content-planner': 'planning',
    'marketing-specialist': 'marketing',
    'ux-ui-designer': 'design',
    'fullstack-developer': 'development',
    'data-scientist': 'data',
    'product-manager': 'planning'
  };
  return mapping[mentorId] || 'planning';
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
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  
  const { isAuthenticated } = useAuthStore();

  // 목업 데이터로 버블 생성
  useEffect(() => {
    const loadCareerData = async () => {
      try {
        setLoading(true);
        
        // 수학적 충돌 방지를 고려한 노드 배치
        const mockBubbleData = {
          interests: [
            {
              id: 'planning',
              name: '기획',
              categoryId: 1,
              size: 'large',
              color: '#FFB562',
              x: -60,
              y: -140,
              type: 'interest'
            },
            {
              id: 'development',
              name: '개발',
              categoryId: 2,
              size: 'large',
              color: '#F28C8C',
              x: -60,
              y: -20,
              type: 'interest'
            },
            {
              id: 'marketing',
              name: '마케팅',
              categoryId: 3,
              size: 'large',
              color: '#6ECEDA',
              x: 60,
              y: -140,
              type: 'interest'
            },
            {
              id: 'design',
              name: '디자인',
              categoryId: 4,
              size: 'large',
              color: '#A8D1FF',
              x: 60,
              y: -20,
              type: 'interest'
            }
          ],
          programs: [
            {
              id: 'pm-program',
              name: 'PM 직무\n멘토링',
              parentIds: ['planning'],
              size: 'small',
              color: '#FFE0B2',
              x: -120,
              y: -200,
              type: 'program'
            },
            {
              id: 'cj-program',
              name: 'CJ 진로\n직업탐색 콘\n텐츠...',
              parentIds: ['planning'],
              size: 'small',
              color: '#FFE0B2',
              x: 0,
              y: -200,
              type: 'program'
            },
            {
              id: 'biotech-program',
              name: '네이버\n직무 탐방\n데이',
              parentIds: ['development'],
              size: 'small',
              color: '#FFD5D5',
              x: -120,
              y: -80,
              type: 'program'
            },
            {
              id: 'side-project',
              name: '소비자 인\n사이트 리서\n치 콘...',
              parentIds: ['marketing', 'planning'],
              size: 'small',
              color: '#A6E3EA',
              x: 0,
              y: -80,
              type: 'program'
            },
            {
              id: 'program-design',
              name: '프그래밍\n쉽게 입문 하\n는요...',
              parentIds: ['development'],
              size: 'small',
              color: '#FFD5D5',
              x: 0,
              y: 40,
              type: 'program'
            },
            {
              id: 'graphic-design',
              name: '그래픽\n디자인 캠프',
              parentIds: ['design'],
              size: 'small',
              color: '#D0E8FF',
              x: 120,
              y: 40,
              type: 'program'
            }
          ]
        };
        
        // 멘토 데이터 추가
        const mentors = getMentorsForCareer().map(mentor => ({
          ...mentor,
          interestId: mapMentorToInterest(mentor.id)
        }));
        
        setData({
          interests: mockBubbleData.interests.map(interest => ({
            ...interest,
            title: generateJobTitle(interest.categoryId),
            description: generateJobDescription(interest.categoryId)
          })),
          programs: mockBubbleData.programs,
          mentors
        });
        
      } catch (error) {
        console.error("Career 데이터 로딩 실패:", error);
        setData({ interests: [], programs: [], mentors: [] });
      } finally {
        setLoading(false);
      }
    };

    loadCareerData();
  }, [isAuthenticated]);

  // 카테고리 ID를 기반으로 직업 제목 생성
  const generateJobTitle = (categoryId) => {
    const jobTitles = {
      1: '과학기술 연구원',
      2: 'IT 개발자', 
      11: '예술 디자이너',
      12: '체육 지도사',
      18: '서비스업 전문가',
      29: '환경에너지 전문가'
    };
    return jobTitles[categoryId] || `분야 ${categoryId} 전문가`;
  };

  // 카테고리 ID를 기반으로 직업 설명 생성
  const generateJobDescription = (categoryId) => {
    const descriptions = {
      1: `
        <h3>주요 업무</h3>
        <p>과학기술 분야의 연구개발을 통해 새로운 기술과 지식을 창출합니다.</p>
        <h3>필요 역량</h3>
        <p>논리적 사고력, 분석능력, 창의성, 끈기, 전문지식이 필요합니다.</p>
      `,
      2: `
        <h3>주요 업무</h3>
        <p>소프트웨어 개발, 시스템 구축, 디지털 솔루션 제공 업무를 담당합니다.</p>
        <h3>필요 역량</h3>
        <p>프로그래밍 능력, 논리적 사고, 문제해결능력, 새로운 기술 학습능력이 중요합니다.</p>
      `,
      11: `
        <h3>주요 업무</h3>
        <p>창의적인 디자인과 예술 작품을 통해 사람들에게 감동과 영감을 전달합니다.</p>
        <h3>필요 역량</h3>
        <p>창의성, 미적 감각, 표현력, 커뮤니케이션 능력, 트렌드 감각이 필요합니다.</p>
      `,
      12: `
        <h3>주요 업무</h3>
        <p>체육 활동 지도와 건강 증진을 통해 사람들의 삶의 질 향상에 기여합니다.</p>
        <h3>필요 역량</h3>
        <p>체력, 리더십, 소통능력, 전문지식, 안전의식이 중요합니다.</p>
      `,
      18: `
        <h3>주요 업무</h3>
        <p>고객 서비스와 만족도 향상을 통해 비즈니스 성공에 기여합니다.</p>
        <h3>필요 역량</h3>
        <p>고객응대능력, 문제해결능력, 커뮤니케이션 스킬, 친화력이 필요합니다.</p>
      `,
      29: `
        <h3>주요 업무</h3>
        <p>환경보호와 친환경 에너지 개발을 통해 지속가능한 미래를 만듭니다.</p>
        <h3>필요 역량</h3>
        <p>환경의식, 분석능력, 기술적 이해력, 사회적 책임감이 중요합니다.</p>
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

  // 선택한 큰 노드에 해당하는 작은 노드 색상 반환
  const getMinorColor = (interestId) => {
    const colorMapping = {
      'planning': '#FFE0B2',
      'development': '#FFD5D5', 
      'marketing': '#A6E3EA',
      'design': '#D0E8FF'
    };
    return colorMapping[interestId] || '#FFE0B2';
  };

  const getRecommendedPrograms = () => {
    return [
      {
        title: "'공간인간' 유현준 교수와 함께 하는 진로콘서트",
        organization: "서구진로교육지원센터",
        date: "2025-08-06 ~ 2025-12-31",
        category: "카테고리",
        tags: ["체험처", "무료"]
      },
      {
        title: "공간인간 유현준 교수와 함께 하는 진로콘서트",
        organization: "서구진로교육지원센터",
        date: "2025-08-06 ~ 2025-12-31",
        category: "카테고리",
        tags: ["체험처", "무료"]
      },
      {
        title: "AI 개발자 멘토링 프로그램",
        organization: "테크 아카데미",
        date: "2025-09-01 ~ 2025-11-30",
        category: "IT개발",
        tags: ["멘토링", "유료"]
      },
      {
        title: "마케팅 전략 수립 및 실행",
        organization: "비즈니스 인사이트",
        date: "2025-10-15 ~ 2025-12-15",
        category: "마케팅",
        tags: ["전략", "실무"]
      }
    ];
  };

  // CSS 기반 연결선 (더 안정적)
  const renderConnections = () => {
    const connections = [];
    
    data.programs.forEach(program => {
      if (program.parentIds && program.parentIds.length > 0) {
        program.parentIds.forEach(parentId => {
          const parent = data.interests.find(interest => interest.id === parentId);
          if (parent) {
            const isConnected = currentState === 'detail' && selectedInterest && 
              (program.parentIds.includes(selectedInterest.id) || parent.id === selectedInterest.id);
            
            const isGrayed = currentState === 'detail' && selectedInterest && !isConnected;
            
            const deltaX = program.x - parent.x;
            const deltaY = program.y - parent.y;
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            
            connections.push(
              <div
                key={`${parent.id}-${program.id}`}
                className={`connection-line ${isGrayed ? 'connection-grayed' : ''}`}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${parent.x}px)`,
                  top: `calc(50% + ${parent.y}px)`,
                  width: `${length}px`,
                  height: '2px',
                  backgroundColor: isGrayed ? '#D3D3D3' : '#D3D3D3',
                  transformOrigin: '0 50%',
                  transform: `rotate(${angle}deg)`,
                  opacity: 0.8,
                  zIndex: 1,
                  pointerEvents: 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            );
          }
        });
      }
    });
    
    return connections;
  };

  const renderBubbles = () => {
    const allBubbles = [...data.interests, ...data.programs];
    
    return allBubbles.map(bubble => {
      const isConnected = currentState === 'detail' && selectedInterest && 
        (bubble.id === selectedInterest.id || 
         (bubble.type === 'program' && bubble.parentIds?.includes(selectedInterest.id)));
      
      const isGrayed = currentState === 'detail' && selectedInterest && !isConnected;
      const isSelected = currentState === 'detail' && selectedInterest && bubble.id === selectedInterest.id;

      // 회색 처리될 때 사용할 색상
      let backgroundColor = bubble.color;
      if (isGrayed) {
        backgroundColor = bubble.size === 'large' ? '#DDDDDD' : '#E7E7E7';
      }

      return (
        <div
          key={bubble.id}
          className={`interest-bubble bubble-${bubble.size} ${isGrayed ? 'grayed' : ''} ${isSelected ? 'selected' : ''}`}
          style={{
            backgroundColor: backgroundColor,
            left: `calc(50% + ${bubble.x}px - ${bubble.size === 'large' ? '45px' : bubble.size === 'medium' ? '48px' : '35px'})`,
            top: `calc(50% + ${bubble.y}px - ${bubble.size === 'large' ? '45px' : bubble.size === 'medium' ? '48px' : '35px'})`
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
    
    const mentors = data.mentors.filter(m => m.interestId === selectedInterest.id);
    
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
              <p className="intro-text">성나미님의 관심사는</p>
              <h1 className="interest-title">기획, 개발,<br />마케팅, 디자인</h1>
            </>
          ) : (
            <>
              <p className="intro-text">선택한 분야를<br />깊이 탐색해보세요</p>
              <h1 className="interest-title">{selectedInterest?.name}</h1>
            </>
          )}
        </div>

        <div className="interest-map">
          {data.interests.length === 0 && data.programs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              아직 체험한 프로그램이 없습니다.
            </div>
          ) : (
            <>
              {/* CSS 연결선 */}
              {renderConnections()}
              {/* 버블 노드 */}
              {renderBubbles()}
            </>
          )}
        </div>


      </div>

      {currentState === 'detail' && selectedInterest && (
        <section className="career__chat-section">
          <div className="career__section-header">
            <h2 className="career__section-title">현직자봇과 진로상담하기</h2>
          </div>
          <div className="career__chat-card" style={{ backgroundColor: selectedInterest?.color }}>
            <div className="chat-card__header">
              <div className="chat-card__avatar">
                <img src="/mock_image_url/korean_woman_1.jpeg" alt="콘텐츠 기획자" />
              </div>
              <div className="chat-card__info">
                <h3 className="chat-card__title">콘텐츠 기획자</h3>
                <p className="chat-card__name">한지민</p>
              </div>
            </div>
            <p className="chat-card__description">
              안녕하세요! 콘텐츠 기획자는 사용자에게 전달할 정보나 이야기를 목적에 맞게 설계하고 효과적으로 구성합니다.
            </p>
            <div className="chat-card__footer">
              <button 
                className="chat-card__button"
                style={{ 
                  backgroundColor: getMinorColor(selectedInterest?.id)
                }}
              >
                대화하기
              </button>
            </div>
          </div>
        </section>
      )}

      {currentState === 'default' && (
        <section className="career__programs-section">
          <div className="career__section-header">
            <h2 className="career__section-title">나에게 딱 맞는 추천 프로그램</h2>
            <span 
              className="career__section-more"
              onClick={() => setShowAllPrograms(!showAllPrograms)}
            >
              {showAllPrograms ? '접기' : '더보기'}
              <img src={showAllIcon} alt="더보기" style={{ marginLeft: '4px', width: '10px', height: '10px' }} />
            </span>
          </div>
          <div className="career__programs-grid">
            {getRecommendedPrograms().slice(0, showAllPrograms ? 4 : 2).map((program, index) => (
              <ProgramCardBasic
                key={index}
                title={program.title}
                organization={program.organization}
                date={program.date}
                category={program.category}
                tags={program.tags}
                onClick={() => {}}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Career;