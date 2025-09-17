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
            title: "프로덕트 매니저 실무 체험",
            mentor: "라인플러스",
            category: "기획",
            startDate: "2024-01-15",
            endDate: "2024-03-15",
            price: 0,
            backgroundColor: "#667eea",
            emoji: "📋",
            imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center",
            description: "실제 프로덕트 개발 과정에서 PM의 역할을 체험하고 기획 역량을 키우는 프로그램입니다."
          },
          {
            programId: 2,
            title: "비즈니스 모델 설계 워크샵",
            mentor: "삼성전자",
            category: "전략기획",
            startDate: "2024-02-01",
            endDate: "2024-04-01",
            price: 50000,
            backgroundColor: "#4ECDC4",
            emoji: "💡",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center",
            description: "스타트업부터 대기업까지, 다양한 비즈니스 모델을 분석하고 직접 설계해보는 실무형 워크샵입니다."
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
      title: "서비스 기획 실무 멘토링",
      mentor: "토스",
      category: "서비스기획",
      startDate: "2024-03-01",
      endDate: "2024-05-01",
      price: 0,
      backgroundColor: "#45B7D1",
      emoji: "📱",
      description: "현직 서비스 기획자와 1:1 멘토링을 통해 실무 기획 역량을 키우는 프로그램입니다."
    },
    {
      programId: 4,
      title: "스타트업 창업 기획 캠프",
      mentor: "스파크랩",
      category: "창업기획",
      startDate: "2024-04-01",
      endDate: "2024-06-01",
      price: 80000,
      backgroundColor: "#96CEB4",
      emoji: "🚀",
      description: "아이디어부터 사업계획서 작성까지, 창업의 전 과정을 기획 관점에서 학습합니다."
    },
    {
      programId: 5,
      title: "콘텐츠 기획자 양성 과정",
      mentor: "CJ ENM",
      category: "콘텐츠기획",
      startDate: "2024-05-01",
      endDate: "2024-07-01",
      price: 120000,
      backgroundColor: "#FFEAA7",
      emoji: "📝",
      description: "유튜브, 인스타그램 등 다양한 플랫폼의 콘텐츠를 기획하고 제작하는 방법을 배웁니다."
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
                tags={[
                  p.category === "전략기획" || p.category === "창업기획" ? "체험처" : "체험처",
                  p.price === 0 ? "무료" : "유료"
                ]}
                imageUrl={p.imageUrl}
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
