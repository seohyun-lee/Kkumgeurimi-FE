import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ProgramDetailModal.css';
import { getCategoryName } from '../utils/category.js';
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
  const [showOverlay, setShowOverlay] = useState(false);
  const modalContentRef = useRef(null);
  const imageRef = useRef(null);


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

const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    setShowOverlay(scrollTop > 30);
  }, []);

useEffect(() => {
    const modalContent = modalContentRef.current;
    if (modalContent && isOpen) {
      modalContent.addEventListener('scroll', handleScroll);
      return () => {
        modalContent.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen, handleScroll]);

  if (!isOpen || !program) return null;

  return (
    <div className="program-detail-modal-backdrop" onClick={handleBackdropClick}>
      <div className="program-detail-modal">
        <div className="modal-image-container" ref={imageRef}>
          {program.imageUrl ? (
            <img src={program.imageUrl} alt={program.programTitle} />
          ) : (
            <div className="modal-image-placeholder">
              <span>이미지</span>
            </div>
          )}
          
{showOverlay && (
            <div className="modal-image-overlay">
              <div className="modal-overlay-content">
                <h2 className="modal-overlay-title">
                  {program.programTitle}
                </h2>
                
                <p className="modal-overlay-provider">
                  {program.provider}
                </p>

                <div className="modal-overlay-date">
                  {program.startDate && program.endDate 
                    ? `${program.startDate} ~ ${program.endDate}`
                    : program.date
                  }
                </div>
              </div>
            </div>
          )}
          
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content" ref={modalContentRef}>
{!showOverlay && (
            <>
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
            </>
          )}

          <div className="program-detail-modal__details">
            <div className="program-detail-modal__section">
              <h3>분야</h3>
              <p>{getCategoryName(program.interestCategory) || '미분류'}</p>
            </div>

            {program.tags && program.tags.includes('현장견학형') && (
              <div className="program-detail-modal__section">
                <h3>프로그램 유형</h3>
                <p>현장견학형</p>
              </div>
            )}

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


            {program.programDetail?.levelInfo && (
              <div className="program-detail-modal__section">
                <h3>대상 학년</h3>
                <p>{program.programDetail.levelInfo}</p>
              </div>
            )}

            <div className="program-detail-modal__section">
              <h3>추가 정보</h3>
              <p>이 프로그램은 학생들의 진로 탐색과 체험을 위한 다양한 활동을 제공합니다.</p>
            </div>

            <div className="program-detail-modal__section">
              <h3>준비물</h3>
              <p>필요한 준비물은 프로그램 신청 시 개별 안내드립니다.</p>
            </div>

            <div className="program-detail-modal__section">
              <h3>문의사항</h3>
              <p>프로그램 관련 문의사항이 있으시면 언제든지 연락주세요.</p>
            </div>

            <div className="program-detail-modal__section">
              <h3>안전 수칙</h3>
              <p>프로그램 참여 시 안전 수칙을 반드시 지켜주세요. 모든 참가자는 안전한 환경에서 체험할 수 있도록 최선을 다하겠습니다.</p>
            </div>

            <div className="program-detail-modal__section">
              <h3>준비사항</h3>
              <p>프로그램 참여 전 필요한 준비사항들을 미리 확인해주세요. 편안한 복장과 필수 준비물을 챙겨오시기 바랍니다.</p>
            </div>

            <div className="program-detail-modal__section">
              <h3>참가 후기</h3>
              <p>이전 참가자들의 후기를 확인해보세요. 실제 체험담을 통해 프로그램에 대한 더 자세한 정보를 얻을 수 있습니다.</p>
            </div>

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