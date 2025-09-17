import React from 'react';
import './ProgramDetailModal.css';
import likeIcon from '../assets/icons/my/like.svg';
import heartEmptyIcon from '../assets/icons/heart_empty.svg';

const ProgramDetailModal = ({ 
  isOpen, 
  onClose, 
  program,
  onLike,
  onApply,
  isLiked = false
}) => {
  if (!isOpen || !program) return null;

  // 카테고리 ID를 카테고리 이름으로 변환
  const getCategoryName = (categoryId) => {
    const categoryMapping = {
      1: '과학기술',
      2: 'IT개발',
      11: '예술디자인',
      12: '체육',
      18: '서비스업',
      29: '환경에너지'
    };
    return categoryMapping[categoryId] || '기타';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLikeClick = () => {
    onLike?.(program);
  };

  const handleApplyClick = () => {
    onApply?.(program);
  };

  return (
    <div className="program-detail-modal-backdrop" onClick={handleBackdropClick}>
      <div className="program-detail-modal">
        {/* 이미지 영역 */}
        <div className="modal-image-container">
          {program.imageUrl ? (
            <img src={program.imageUrl} alt={program.programTitle} />
          ) : (
            <div className="modal-image-placeholder">
              <span>이미지</span>
            </div>
          )}
          
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="modal-content">
          <h2 className="program-detail-modal__title">
            {program.programTitle}
          </h2>
          
          <p className="program-detail-modal__provider">
            {program.provider}
          </p>

          <div className="program-detail-modal__date">
            {program.startDate && program.endDate 
              ? `${program.startDate} ~ ${program.endDate}`
              : program.date
            }
          </div>

          {/* 태그들 - 중복 제거 */}
          <div className="program-detail-modal__tags">
            {program.tags && program.tags.filter(tag => 
              tag !== '무료' && 
              tag !== '유료' && 
              tag !== '중고등학생' && 
              tag !== '고등학생' &&
              tag !== '중학생' &&
              tag !== '체험처'
            ).map((tag, index) => (
              <span key={index} className="program-detail-modal__tag">
                {tag}
              </span>
            ))}
          </div>

          {/* 프로그램 상세 정보 */}
          <div className="program-detail-modal__details">
            {/* 분야 카테고리 */}
            <div className="program-detail-modal__section">
              <h3>분야</h3>
              <p>{getCategoryName(program.interestCategory) || '미분류'}</p>
            </div>

            {/* program_detail 엔티티 필드들 */}
            {program.programDetail?.description && (
              <div className="program-detail-modal__section">
                <h3>목표</h3>
                <p>{program.programDetail.description}</p>
              </div>
            )}

            {program.programDetail?.requiredHours && (
              <div className="program-detail-modal__section">
                <h3>체험 이수 시간</h3>
                <p>{program.programDetail.requiredHours}</p>
              </div>
            )}

            {program.programDetail?.availHours && (
              <div className="program-detail-modal__section">
                <h3>체험 가능 시간</h3>
                <p>{program.programDetail.availHours}</p>
              </div>
            )}

            {program.programDetail?.capacity && (
              <div className="program-detail-modal__section">
                <h3>모집 인원</h3>
                <p>{program.programDetail.capacity}명</p>
              </div>
            )}

            {program.programDetail?.targetSchoolType && (
              <div className="program-detail-modal__section">
                <h3>대상 학교 유형</h3>
                <p>{program.programDetail.targetSchoolType}</p>
              </div>
            )}

            {program.programDetail?.levelInfo && (
              <div className="program-detail-modal__section">
                <h3>대상 학년</h3>
                <p>{program.programDetail.levelInfo}</p>
              </div>
            )}

            {/* program 엔티티 필드들 */}
            {program.relatedMajor && (
              <div className="program-detail-modal__section">
                <h3>체험 직무/학과</h3>
                <p>{program.relatedMajor}</p>
              </div>
            )}

            {program.eligibleRegion && (
              <div className="program-detail-modal__section">
                <h3>신청 가능 지역</h3>
                <p>{program.eligibleRegion}</p>
              </div>
            )}

            {program.venueRegion && (
              <div className="program-detail-modal__section">
                <h3>진행 장소</h3>
                <p>{program.venueRegion}</p>
              </div>
            )}

            {program.operateCycle && (
              <div className="program-detail-modal__section">
                <h3>운영 주기</h3>
                <p>{program.operateCycle}</p>
              </div>
            )}

            {/* 참가비 - 무료/유료 모두 표시 */}
            <div className="program-detail-modal__section">
              <h3>참가비</h3>
              <p>
                {program.costType === 'FREE' 
                  ? '무료' 
                  : program.price || '유료 (금액 미정)'
                }
              </p>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="program-detail-modal__actions">
            <button 
              className={`program-detail-modal__like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLikeClick}
            >
              <img 
                src={isLiked ? likeIcon : heartEmptyIcon} 
                alt="찜하기" 
                className="heart-icon"
              />
            </button>
            
            <button 
              className="program-detail-modal__apply-btn"
              onClick={handleApplyClick}
            >
              신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailModal;