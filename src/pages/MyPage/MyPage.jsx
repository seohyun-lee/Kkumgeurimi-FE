import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgramCardBasic from "../../components/ProgramCardBasic";
import { useProgramModal } from "../../contexts/ProgramModalContext.jsx";
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
  const { user: authUser, fetchUserProfile, isAuthenticated } = useAuthStore();
  const [joinedPrograms, setJoinedPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPrograms, setLikedPrograms] = useState(new Set());
  const { openModal } = useProgramModal();

  const user = {
    name: authUser?.name || "성나미",
    email: authUser?.email || "donggeurami@naver.com",
    imageUrl: authUser?.imageUrl || seongnaemiImage,
    phone: authUser?.phone || "",
    address: authUser?.address || "",
    school: authUser?.school || "",
    career: authUser?.career || ""
  };

  // 사용자 정보가 로드되기를 기다린 후 프로그램 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 인증된 상태이지만 사용자 정보가 없으면 프로필 가져오기
        if (isAuthenticated && !authUser) {
          console.log('[MyPage] Fetching user profile...');
          await fetchUserProfile();
        }
        
        // /my/upcoming API를 사용하여 참여 예정 프로그램 조회
        const programs = await meService.getUpcomingPrograms();
        setJoinedPrograms(programs || []);
      } catch (error) {
        console.error('참여 예정 프로그램 조회 실패:', error);
        // 실패 시 빈 배열로 설정 (서비스에서 더미 데이터를 제공하므로)
        setJoinedPrograms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, authUser, fetchUserProfile]);

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
    openModal(program.programId || program.id);
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
          <Link to="/my/completed" className="mypage__activity-item">
            <div className="mypage__activity-icon">
              <img src={programIcon} alt="참여 프로그램" />
            </div>
            <div className="mypage__activity-text">참여 프로그램 내역</div>
            <div className="mypage__activity-arrow">
              <img src={showAllIcon} alt="더보기" style={{ width: '16px', height: '16px' }} />
            </div>
          </Link>
          <div className="mypage__activity-item">
            <div className="mypage__activity-icon">
              <img src={likeIcon} alt="찜한 프로그램" />
            </div>
            <div className="mypage__activity-text">찜한 프로그램 내역</div>
            <div className="mypage__activity-arrow">
              <img src={showAllIcon} alt="더보기" style={{ width: '16px', height: '16px' }} />
            </div>
          </div>
          <div className="mypage__activity-item">
            <div className="mypage__activity-icon">
              <img src={mypostIcon} alt="나의 꿈터 글" />
            </div>
            <div className="mypage__activity-text">나의 꿈터 글</div>
            <div className="mypage__activity-arrow">
              <img src={showAllIcon} alt="더보기" style={{ width: '16px', height: '16px' }} />
            </div>
          </div>
          <div className="mypage__activity-item">
            <div className="mypage__activity-icon">
              <img src={thumbupIcon} alt="공감한 꿈터 글" />
            </div>
            <div className="mypage__activity-text">공감한 꿈터 글</div>
            <div className="mypage__activity-arrow">
              <img src={showAllIcon} alt="더보기" style={{ width: '16px', height: '16px' }} />
            </div>
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
                title={p.programTitle || p.title}
                organization={p.provider || p.mentor}
                date={`${p.startDate} ~ ${p.endDate}`}
                category={p.interestCategoryLabel || p.category || "카테고리"}
                tags={[
                  p.programTypeLabel || "체험처",
                  p.costType === "FREE" ? "무료" : "유료"
                ]}
                imageUrl={p.imageUrl}
                onClick={() => handleProgramClick(p)}
              />
            ))
          ) : (
            <p className="mypage__empty">아직 참여 예정인 프로그램이 없습니다.</p>
          )}
        </div>
      </section>

      {/* 프로그램 상세 모달 */}
    </div>
  );
}
