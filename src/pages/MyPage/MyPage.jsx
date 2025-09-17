import React, { useState, useEffect } from "react";
import ProgramCardBasic from "../../components/ProgramCardBasic";
import ProgramDetailModal from "../../components/ProgramDetailModal.jsx";
import { getCategoryName } from "../../utils/category.js";
import { useAuthStore } from "../../store/auth.store.js";
import { meService } from "../../services/my.service.js";
import { programsService } from "../../services/programs.service.js";
import "./MyPage.css";
import seongnaemiImage from "../../assets/img/성나미.png";
import programIcon from "../../assets/icons/my/program.svg";
import likeIcon from "../../assets/icons/my/like.svg";
import mypostIcon from "../../assets/icons/my/mypost.svg";
import thumbupIcon from "../../assets/icons/my/thumbup.svg";
import showAllIcon from "../../assets/icons/showall.svg";

export default function MyPage() {
  // 목업 데이터로 하드코딩
  const { user: authUser } = useAuthStore();
  const [joinedPrograms, setJoinedPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [likedPrograms, setLikedPrograms] = useState(new Set());

  const user = {
    name: authUser?.name || "성나미",
    email: authUser?.email || "donggeurami@naver.com",
    imageUrl: authUser?.imageUrl || seongnaemiImage,
    phone: authUser?.phone || "",
    address: authUser?.address || "",
    school: authUser?.school || "",
    career: authUser?.career || ""
  };

  useEffect(() => {
    const fetchJoinedPrograms = async () => {
      try {
        setIsLoading(true);
        const programs = await meService.getRegistrations();
        setJoinedPrograms(programs || []);
      } catch (error) {
        console.error('참여 프로그램 조회 실패:', error);
        // 실패 시 목업 데이터 사용
        setJoinedPrograms([
          {
            programId: 1,
            title: "프론트엔드 개발자 취업 준비반",
            mentor: "김멘토",
            category: "개발",
            startDate: "2024-01-15",
            endDate: "2024-03-15",
            price: 299000,
            backgroundColor: "#FF6B6B",
            emoji: "💻",
            description: "React, Vue.js 등 현대적인 프론트엔드 기술을 배우고 취업에 성공할 수 있도록 도와드립니다."
          },
          {
            programId: 2,
            title: "UX/UI 디자인 기초 과정",
            mentor: "이디자이너",
            category: "디자인",
            startDate: "2024-02-01",
            endDate: "2024-04-01",
            price: 399000,
            backgroundColor: "#4ECDC4",
            emoji: "🎨",
            description: "사용자 경험과 인터페이스 디자인의 기본 원리를 배우고 실무에 적용할 수 있는 능력을 기릅니다."
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJoinedPrograms();
  }, []);

  const [likedProgramsData] = useState([
    {
      programId: 3,
      title: "데이터 사이언스 입문",
      mentor: "박데이터",
      category: "데이터",
      startDate: "2024-03-01",
      endDate: "2024-05-01",
      price: 499000,
      backgroundColor: "#45B7D1",
      emoji: "📊",
      description: "Python을 활용한 데이터 분석과 머신러닝의 기초를 배우는 과정입니다."
    },
    {
      programId: 4,
      title: "마케팅 전략 수립",
      mentor: "최마케터",
      category: "마케팅",
      startDate: "2024-04-01",
      endDate: "2024-06-01",
      price: 349000,
      backgroundColor: "#96CEB4",
      emoji: "📈",
      description: "디지털 마케팅의 핵심 전략과 실행 방법을 체계적으로 학습합니다."
    },
    {
      programId: 5,
      title: "창업 아이디어 발굴 및 검증",
      mentor: "정창업가",
      category: "창업",
      startDate: "2024-05-01",
      endDate: "2024-07-01",
      price: 599000,
      backgroundColor: "#FFEAA7",
      emoji: "🚀",
      description: "창업 아이디어를 발굴하고 시장 검증을 통해 사업화 가능성을 높이는 방법을 배웁니다."
    }
  ]);

  // 모달 관련 함수들
  const handleProgramClick = (program) => {
    // 프로그램 데이터를 Career/Home과 동일한 구조로 변환
    const transformedProgram = {
      programId: program.programId || program.id,
      programTitle: program.title,
      provider: program.mentor || program.provider,
      objective: program.description || '프로그램 설명이 없습니다.',
      targetAudience: '중고등학생',
      programType: 1,
      startDate: program.startDate,
      endDate: program.endDate,
      relatedMajor: program.category || '기타',
      costType: 'FREE',
      price: null,
      imageUrl: program.imageUrl || null,
      eligibleRegion: '전국',
      venueRegion: program.mentor || '미정',
      operateCycle: '주 1회',
      interestCategory: 1, // 기본값
      programDetail: {
        programDetailId: `detail-${program.programId || program.id}`,
        description: program.description || '프로그램 상세 설명이 없습니다.',
        requiredHours: '총 2시간',
        availHours: '주말 오후',
        capacity: 20,
        targetSchoolType: '중학교, 고등학교',
        levelInfo: '중학생, 고등학생'
      },
      tags: ['체험처', '무료']
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
    <div className="mypage">
      <section className="mypage__profile-section">
        <div className="mypage__section-header">
          <h2 className="mypage__section-title">내 정보</h2>
        </div>
        <div className="mypage__profile-card">
          <div className="mypage__avatar">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">🙂</div>
            )}
          </div>
          <div className="mypage__profile-info">
            <div className="mypage__name">{user.name}</div>
            <div className="mypage__email">{user.email}</div>
          </div>
        </div>
      </section>

      <section className="mypage__activity-section">
        <div className="mypage__section-header">
          <h2 className="mypage__section-title">나의 활동</h2>
        </div>
        <div className="mypage__activity-grid">
          <div className="mypage__activity-item">
            <div className="mypage__activity-icon">
              <img src={programIcon} alt="참여 프로그램" />
            </div>
            <div className="mypage__activity-text">참여 프로그램 내역</div>
            <div className="mypage__activity-arrow">›</div>
          </div>
          <div className="mypage__activity-item">
            <div className="mypage__activity-icon">
              <img src={likeIcon} alt="찜한 프로그램" />
            </div>
            <div className="mypage__activity-text">찜한 프로그램 내역</div>
            <div className="mypage__activity-arrow">›</div>
          </div>
          <div className="mypage__activity-item">
            <div className="mypage__activity-icon">
              <img src={mypostIcon} alt="나의 꿈터 글" />
            </div>
            <div className="mypage__activity-text">나의 꿈터 글</div>
            <div className="mypage__activity-arrow">›</div>
          </div>
          <div className="mypage__activity-item">
            <div className="mypage__activity-icon">
              <img src={thumbupIcon} alt="공감한 꿈터 글" />
            </div>
            <div className="mypage__activity-text">공감한 꿈터 글</div>
            <div className="mypage__activity-arrow">›</div>
          </div>
        </div>
      </section>

      <section className="mypage__programs-section">
        <div className="mypage__section-header">
          <h2 className="mypage__section-title">참여 예정 프로그램</h2>
          <span className="mypage__section-more">
            더보기
            <img src={showAllIcon} alt="더보기" style={{ marginLeft: '4px', width: '10px', height: '10px' }} />
          </span>
        </div>
        <div className="mypage__programs-grid">
          {joinedPrograms.length > 0 ? (
            joinedPrograms.slice(0, 2).map((p) => (
              <ProgramCardBasic
                key={p.programId}
                title={p.title}
                organization={p.mentor}
                date={`${p.startDate} ~ ${p.endDate}`}
                category={p.category || "카테고리"}
                tags={["체험처", "무료"]}
                onClick={() => handleProgramClick(p)}
              />
            ))
          ) : (
            <p className="mypage__empty">아직 참여한 프로그램이 없습니다.</p>
          )}
        </div>
      </section>

      {/* 프로그램 상세 모달 */}
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
