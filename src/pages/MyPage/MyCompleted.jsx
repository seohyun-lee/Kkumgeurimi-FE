import React, { useState, useEffect } from 'react';
import ProgramCardLong from '../../components/ProgramCardLong';
import ReviewModal from '../../components/ReviewModal';
import { meService } from '../../services/my.service';
import './MyCompleted.css';

const MyCompleted = () => {
  const [registeredPrograms, setRegisteredPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    program: null
  });

  // 목업 데이터
  const mockData = [
    {
      programId: "1",
      programTitle: "'공간인간' 유현준 교수와 함께 하는 진로콘서트",
      provider: "서구진로교육지원센터",
      startDate: "2025-12-31",
      endDate: "2025-12-31",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center",
      interestCategoryLabel: "카테고리",
      registrationStatus: "REGISTERED",
      isReviewed: true,
      reviewScore: "5",
      reviewMessage: "진로에 대한 고민이 많았는데 구체적인 방향성을 찾을 수 있었어요. 특히 강연 후 교수님과의 질의응답 시간이 가장 유익했습니다.",
      experienceDate: "2025-09-19T00:02:20.118Z"
    },
    {
      programId: "2",
      programTitle: "프로덕트 매니저 실무 체험 프로그램",
      provider: "라인플러스",
      startDate: "2025-01-15",
      endDate: "2025-03-15",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center",
      interestCategoryLabel: "기획",
      registrationStatus: "REGISTERED",
      isReviewed: false,
      reviewScore: "",
      reviewMessage: "",
      experienceDate: null
    },
    {
      programId: "3",
      programTitle: "디자인 씽킹 워크샵",
      provider: "삼성전자",
      startDate: "2025-02-01",
      endDate: "2025-04-01",
      imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop&crop=center",
      interestCategoryLabel: "디자인",
      registrationStatus: "REGISTERED",
      isReviewed: true,
      reviewScore: "4",
      reviewMessage: "실무진과 함께하는 프로젝트가 정말 도움이 되었습니다. 다만 시간이 조금 부족했던 것 같아요.",
      experienceDate: "2025-02-15T10:30:00.000Z"
    },
    {
      programId: "4",
      programTitle: "스타트업 창업 멘토링",
      provider: "코리아스타트업포럼",
      startDate: "2025-03-10",
      endDate: "2025-05-10",
      imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop&crop=center",
      interestCategoryLabel: "창업",
      registrationStatus: "REGISTERED",
      isReviewed: false,
      reviewScore: "",
      reviewMessage: "",
      experienceDate: null
    }
  ];

  useEffect(() => {
    const fetchCompletedPrograms = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await meService.getCompletedPrograms();
        setRegisteredPrograms(data);
      } catch (error) {
        console.error('완료된 프로그램 조회 실패:', error);
        setError('프로그램 목록을 불러오는데 실패했습니다.');
        // 개발 환경에서는 목업 데이터 사용
        if (process.env.NODE_ENV === 'development') {
          setRegisteredPrograms(mockData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedPrograms();
  }, []);

  const handleReviewClick = (program) => {
    setReviewModal({
      isOpen: true,
      program: program
    });
  };

  const handleCloseReviewModal = () => {
    setReviewModal({
      isOpen: false,
      program: null
    });
  };

  const handleSubmitReview = async (programId, reviewData) => {
    try {
      await meService.createReview(programId, reviewData);
      
      // 성공 시 목록 새로고침
      const updatedData = await meService.getCompletedPrograms();
      setRegisteredPrograms(updatedData);
      
      alert('리뷰가 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      throw error; // ReviewModal에서 에러 처리하도록 전달
    }
  };

  if (isLoading) {
    return (
      <div className="my-completed">
        <div className="my-completed__loading">
          <p>프로그램 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && registeredPrograms.length === 0) {
    return (
      <div className="my-completed">
        <div className="my-completed__error">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="my-completed__retry-btn"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-completed">
      <div className="my-completed__subtitle">
        총 {registeredPrograms.length}개
      </div>

      <div className="my-completed__content">
        {registeredPrograms.length > 0 ? (
          <div className="my-completed__grid">
            {registeredPrograms.map((program) => (
              <ProgramCardLong
                key={program.programId}
                programData={program}
                onClick={() => console.log('프로그램 클릭:', program.programId)}
                onReviewClick={() => handleReviewClick(program)}
              />
            ))}
          </div>
        ) : (
          <div className="my-completed__empty">
            <p>아직 참여한 프로그램이 없습니다.</p>
            <p>다양한 프로그램에 참여해보세요!</p>
          </div>
        )}
      </div>

      {/* 리뷰 작성 모달 */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={handleCloseReviewModal}
        program={reviewModal.program}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default MyCompleted;
