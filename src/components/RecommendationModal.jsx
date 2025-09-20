import React from 'react';
import './RecommendationModal.css';

const RecommendationModal = ({ isOpen, onClose, program }) => {
  if (!isOpen || !program) return null;

  const formatCostType = (costType) => {
    return costType === 'FREE' ? '무료' : '유료';
  };

  const formatTargetAudience = (audience) => {
    if (!audience) return '미정';
    return audience
      .replace('초', '초등학생')
      .replace('중', '중학생')
      .replace('고', '고등학생')
      .replace(/\s+/g, ', ');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="recommendation-modal-backdrop" onClick={handleBackdropClick}>
      <div className="recommendation-modal">
        <div className="recommendation-modal__header">
          <h3 className="recommendation-modal__title">프로그램 정보</h3>
          <button
            className="recommendation-modal__close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="recommendation-modal__content">
          <div className="recommendation-modal__main-info">
            <h4 className="program-title">
              {program.program_title || program.title || program.name}
            </h4>
            <p className="program-provider">{program.provider}</p>
          </div>

          <div className="recommendation-modal__details">
            <div className="detail-row">
              <span className="detail-label">매칭도:</span>
              <span className="detail-value">{Math.round(program.score * 100)}%</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">프로그램 유형:</span>
              <span className="detail-value">{program.program_type}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">참가비:</span>
              <span className="detail-value">{formatCostType(program.cost_type)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">대상:</span>
              <span className="detail-value">{formatTargetAudience(program.target_audience)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">관련 직무/학과:</span>
              <span className="detail-value">{program.related_major}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">지역:</span>
              <span className="detail-value">{program.venue_region}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">기간:</span>
              <span className="detail-value">
                {program.start_date} ~ {program.end_date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;