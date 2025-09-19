import React from 'react';
import './ProgramCardLong.css';
import institutionIcon from '../assets/icons/my/institution.svg';
import calendarIcon from '../assets/icons/my/calendar.svg';

const ProgramCardLong = ({ 
  programData,
  className = '',
  onClick,
  onReviewClick,
  ...props 
}) => {
  const {
    programTitle,
    provider,
    startDate,
    endDate,
    imageUrl,
    interestCategoryLabel,
    registrationStatus,
    isReviewed,
    reviewScore,
    reviewMessage,
    experienceDate
  } = programData;

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 표시할 날짜 결정 (리뷰가 있으면 experienceDate, 없으면 startDate)
  const displayDate = isReviewed && experienceDate ? formatDate(experienceDate) : formatDate(startDate);

  return (
    <div
      className={`program-card-long ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* 이미지 영역 + 카테고리 */}
      <div className="program-card-long__image">
        <span className="program-card-long__category">{interestCategoryLabel}</span>
        {imageUrl ? (
          <img src={imageUrl} alt={programTitle} />
        ) : (
          <div className="program-card-long__placeholder">
            <span>이미지</span>
          </div>
        )}
      </div>
      
      {/* 카드 콘텐츠 */}
      <div className="program-card-long__content">
        <h3 className="program-card-long__title">{programTitle}</h3>
        
        {/* 날짜 및 기관 정보 */}
        <div className="program-card-long__info-row">
          <div className="program-card-long__date">
            <img src={calendarIcon} alt="날짜" className="program-card-long__date-icon" />
            <span>{displayDate}</span>
          </div>
          
          <div className="program-card-long__provider">
            <img src={institutionIcon} alt="기관" className="program-card-long__provider-icon" />
            <span>{provider}</span>
          </div>
        </div>
        
        {/* 리뷰 영역 또는 리뷰 작성하기 버튼 */}
        {isReviewed ? (
          <div className="program-card-long__review">
            <div className="program-card-long__review-score">
              {'★'.repeat(parseInt(reviewScore)) + '☆'.repeat(5 - parseInt(reviewScore))}
            </div>
            <p className="program-card-long__review-message">{reviewMessage}</p>
          </div>
        ) : (
          <button 
            className="program-card-long__review-button"
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 이벤트 방지
              onReviewClick && onReviewClick();
            }}
          >
            리뷰 작성하기
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgramCardLong;
