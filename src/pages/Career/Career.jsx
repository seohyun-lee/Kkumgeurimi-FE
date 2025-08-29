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
  
  const { isAuthenticated } = useAuthStore();

  // API 데이터로 버블 생성
  useEffect(() => {
    const loadCareerData = async () => {
      try {
        setLoading(true);
        
        // 토큰을 authService에서 직접 가져오기
        const token = authService.getCurrentToken();
        
        console.log("🔐 Career 컴포넌트에서 토큰 확인:", {
          token: token ? `토큰 있음: ${token.substring(0, 10)}...` : "토큰 없음",
          tokenType: typeof token,
          tokenLength: token ? token.length : 0,
          isAuthenticated
        });
        
        // API에서 버블 데이터 생성 (토큰 전달)
        const bubbleData = await careerService.generateBubbleData(token);
        console.log("🎯 생성된 버블 데이터:", bubbleData);
        
        // 멘토 데이터 추가
        const mentors = getMentorsForCareer().map(mentor => ({
          ...mentor,
          interestId: mapMentorToInterest(mentor.id)
        }));
        
        setData({
          interests: bubbleData.interests.map(interest => ({
            ...interest,
            title: generateJobTitle(interest.categoryId),
            description: generateJobDescription(interest.categoryId),
            background: `bg-category-${interest.categoryId}`
          })),
          programs: bubbleData.programs,
          mentors
        });
        
      } catch (error) {
        console.error("Career 데이터 로딩 실패:", error);
        // 에러 시 빈 데이터로 설정
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
                <h3>관련 멘토</h3>
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