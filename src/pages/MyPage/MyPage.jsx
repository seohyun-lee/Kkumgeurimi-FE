import React, { useState } from "react";
import ProgramCard from "../../components/ProgramCard";
import "./MyPage.css";

export default function MyPage() {
  // 목업 데이터로 하드코딩
  const [user] = useState({
    name: "김철수",
    email: "user@example.com",
    imageUrl: null
  });

  const [joinedPrograms] = useState([
    {
      programId: 1,
      programTitle: "프론트엔드 개발자 취업 준비반",
      provider: "테크 이노베이션 센터",
      relatedMajor: "웹 개발",
      startDate: "2025-01-15",
      endDate: "2025-03-15",
      venueRegion: "서울",
      targetAudience: "고등학생",
      price: 0,
      imageUrl: null,
      icon: "💻",
      backgroundColor: "#A5B4FC",
      description: "React, Vue.js 등 현대적인 프론트엔드 기술을 배우고 취업에 성공할 수 있도록 도와드립니다."
    },
    {
      programId: 2,
      programTitle: "UX/UI 디자인 기초 과정",
      provider: "크리에이티브 스튜디오",
      relatedMajor: "디자인",
      startDate: "2025-02-01",
      endDate: "2025-04-01",
      venueRegion: "경기",
      targetAudience: "고등학생",
      price: 50000,
      imageUrl: null,
      icon: "🎨",
      backgroundColor: "#FDBA74",
      description: "사용자 경험과 인터페이스 디자인의 기본 원리를 배우고 실무에 적용할 수 있는 능력을 기릅니다."
    }
  ]);

  const [likedPrograms] = useState([
    {
      programId: 3,
      programTitle: "데이터 사이언스 입문",
      provider: "데이터 사이언스 연구소",
      relatedMajor: "데이터 분석",
      startDate: "2025-03-01",
      endDate: "2025-05-01",
      venueRegion: "서울",
      targetAudience: "고등학생",
      price: 0,
      imageUrl: null,
      icon: "📈",
      backgroundColor: "#93C5FD",
      description: "Python을 활용한 데이터 분석과 머신러닝의 기초를 배우는 과정입니다."
    },
    {
      programId: 4,
      programTitle: "마케팅 전략 수립",
      provider: "마케팅 이노베이션 센터",
      relatedMajor: "마케팅",
      startDate: "2025-04-01",
      endDate: "2025-06-01",
      venueRegion: "부산",
      targetAudience: "고등학생",
      price: 30000,
      imageUrl: null,
      icon: "📢",
      backgroundColor: "#F9A8D4",
      description: "디지털 마케팅의 핵심 전략과 실행 방법을 체계적으로 학습합니다."
    },
    {
      programId: 5,
      programTitle: "창업 아이디어 발굴 및 검증",
      provider: "창업 지원 센터",
      relatedMajor: "창업",
      startDate: "2025-05-01",
      endDate: "2025-07-01",
      venueRegion: "대구",
      targetAudience: "고등학생",
      price: 0,
      imageUrl: null,
      icon: "🚀",
      backgroundColor: "#FDBA74",
      description: "창업 아이디어를 발굴하고 시장 검증을 통해 사업화 가능성을 높이는 방법을 배웁니다."
    }
  ]);

  return (
    <div className="mypage">
      <header className="mypage__header">
        <h1 className="mypage__title">내 정보</h1>
        <div className="mypage__profile">
          <div className="mypage__avatar">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">🙂</div>
            )}
          </div>
          <div className="mypage__info">
            <div className="mypage__name">{user.name}</div>
            <div className="mypage__email">{user.email}</div>
          </div>
        </div>
      </header>

      <section className="mypage__section">
        <h2>참여 프로그램</h2>
        <div className="mypage__grid">
          {joinedPrograms.length > 0 ? (
            joinedPrograms.map((p) => (
              <ProgramCard key={p.programId} program={p} isLiked={false} />
            ))
          ) : (
            <p className="mypage__empty">아직 참여한 프로그램이 없습니다.</p>
          )}
        </div>
      </section>

      <section className="mypage__section">
        <h2>찜한 프로그램</h2>
        <div className="mypage__grid">
          {likedPrograms.length > 0 ? (
            likedPrograms.map((p) => (
              <ProgramCard key={p.programId} program={p} isLiked={true} />
            ))
          ) : (
            <p className="mypage__empty">찜한 프로그램이 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
