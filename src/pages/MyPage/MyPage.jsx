import React, { useState } from "react";
import ProgramCard from "../../components/ProgramCard";
import "./MyPage.css";

export default function MyPage() {
  // 목업 데이터로 하드코딩
  const [user] = useState({
    name: "김동이",
    email: "user@example.com",
    imageUrl: null
  });

  const [joinedPrograms] = useState([
    {
      programId: 1,
      title: "프론트엔드 개발자 취업 준비반",
      mentor: "김멘토",
      category: "개발",
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      imageUrl: "/mock_image_url/korean_man_1.jpeg",
      description: "React, Vue.js 등 현대적인 프론트엔드 기술을 배우고 취업에 성공할 수 있도록 도와드립니다."
    },
    {
      programId: 2,
      title: "UX/UI 디자인 기초 과정",
      mentor: "이디자이너",
      category: "디자인",
      startDate: "2024-02-01",
      endDate: "2024-04-01",
      imageUrl: "/mock_image_url/korean_woman_1.jpeg",
      description: "사용자 경험과 인터페이스 디자인의 기본 원리를 배우고 실무에 적용할 수 있는 능력을 기릅니다."
    }
  ]);

  const [likedPrograms] = useState([
    {
      programId: 3,
      title: "데이터 사이언스 입문",
      mentor: "박데이터",
      category: "데이터",
      startDate: "2024-03-01",
      endDate: "2024-05-01",
      imageUrl: "/mock_image_url/korean_man_2.jpeg",
      description: "Python을 활용한 데이터 분석과 머신러닝의 기초를 배우는 과정입니다."
    },
    {
      programId: 4,
      title: "마케팅 전략 수립",
      mentor: "최마케터",
      category: "마케팅",
      startDate: "2024-04-01",
      endDate: "2024-06-01",
      imageUrl: "/mock_image_url/korean_woman_2.jpeg",
      description: "디지털 마케팅의 핵심 전략과 실행 방법을 체계적으로 학습합니다."
    },
    {
      programId: 5,
      title: "창업 아이디어 발굴 및 검증",
      mentor: "정창업가",
      category: "창업",
      startDate: "2024-05-01",
      endDate: "2024-07-01",
      imageUrl: "/mock_image_url/korean_man_1.jpeg",
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
