import React from 'react';
import { FaRegStar, FaStar, FaFileAlt, FaTimes } from 'react-icons/fa';
import { getLabelByCode } from '../config/constants';
import './ProgramDetailModal.css';

export default function ProgramDetailModal({ program, isOpen, onClose, isLiked, onLike, onApply }) {
  if (!isOpen || !program) return null;

  // API 응답 필드명 매핑
  const programId = program.programId || program.program_id;
  const title = program.programTitle || program.title;
  const provider = program.provider;
  const description = program.description || "프로그램에 대한 상세한 설명이 제공되지 않았습니다.";
  const targetAudience = program.targetAudience || program.target_audience;
  const programType = program.programType || program.program_type;
  const startDate = program.startDate || program.start_date;
  const endDate = program.endDate || program.end_date;
  const relatedMajor = program.relatedMajor || program.job_field;
  const price = program.price;
  const imageUrl = program.imageUrl;
  const eligibleRegion = program.eligibleRegion || program.venue_region;
  const venueRegion = program.venueRegion || program.venue;
  const operateCycle = program.operateCycle || program.operate_cycle;
  const interestCategoryId = program.interestCategoryId;
  const interestText = program.interestText || program.field_category;
  const likeCount = program.likeCount || 0;
  const registrationCount = program.registrationCount || 0;
  const requiredHours = program.requiredHours;
  const availHours = program.availHours || program.avail_hours;
  const capacity = program.capacity;
  const targetSchoolType = program.targetSchoolType;

  // 가격 표시 포맷팅
  const formatPrice = (price) => {
    if (price === "0" || price === 0) return "무료";
    return `${Number(price).toLocaleString()}원`;
  };

  // 기간 표시 포맷팅
  const formatPeriod = (start, end) => {
    if (start && end) {
      return `${start} ~ ${end}`;
    }
    return start || "미정";
  };

  // 운영시간 표시 포맷팅
  const formatOperatingHours = (cycle, hours) => {
    if (cycle && hours) {
      return `${cycle} ${hours}`;
    }
    return hours || cycle || "미정";
  };

  return (
    <div className="program-detail-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="modal-body">
          {/* 프로그램 제목 및 제공자 */}
          <div className="program-header">
            <h2 className="program-title">{title}</h2>
            <div className="program-provider">{provider}</div>
          </div>

          {/* 프로그램 설명 */}
          {description && (
            <div className="program-description">
              {description}
            </div>
          )}

          {/* 프로그램 정보 그리드 */}
          <div className="program-info-grid">
            <div className="info-item">
              <span className="info-label">프로그램 유형</span>
              <span className="info-value">{programType || "미정"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">대상</span>
              <span className="info-value">{targetAudience || "미정"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">지역</span>
              <span className="info-value">{eligibleRegion || "전국"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">참가비</span>
              <span className="info-value">{formatPrice(price)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">모집인원</span>
              <span className="info-value">{capacity ? `${capacity}명` : "미정"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">운영시간</span>
              <span className="info-value">{formatOperatingHours(operateCycle, availHours)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">장소</span>
              <span className="info-value">{venueRegion || "미정"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">관련직종</span>
              <span className="info-value">{relatedMajor || "미정"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">기간</span>
              <span className="info-value">{formatPeriod(startDate, endDate)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">분야</span>
              <span className="info-value">
                {interestCategoryId ? getLabelByCode(interestCategoryId) : (interestText || "미정")}
              </span>
            </div>
            {requiredHours && (
              <div className="info-item">
                <span className="info-label">필요시간</span>
                <span className="info-value">{requiredHours}</span>
              </div>
            )}
            {targetSchoolType && (
              <div className="info-item">
                <span className="info-label">대상학교</span>
                <span className="info-value">{targetSchoolType}</span>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="action-buttons">
            <button className="btn-apply" onClick={() => onApply?.(programId)}>
              <FaFileAlt />
              <span>신청하기</span>
            </button>
            <button 
              className={`btn-like ${isLiked ? 'liked' : ''}`} 
              onClick={() => onLike?.(programId)}
            >
              {isLiked ? <FaStar /> : <FaRegStar />}
              <span>찜하기</span>
            </button>
          </div>

          {/* 커뮤니티 섹션 */}
          <div className="community-section">
            <div className="community-header">
              <span className="community-title">커뮤니티</span>
              <span className="community-count">{likeCount + registrationCount}</span>
            </div>
            <div className="community-preview">
              <div className="community-item">
                <span className="user-name">김서연</span>
                <span className="user-status">관심있음</span>
                <span className="time-ago">2시간 전</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
