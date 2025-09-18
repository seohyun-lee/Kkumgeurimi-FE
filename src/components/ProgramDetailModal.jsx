import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ProgramDetailModal.css';
import { getCategoryName } from '../utils/category.js';
import { useProgramModal } from '../contexts/ProgramModalContext.jsx';
import likeIcon from '../assets/icons/my/like.svg';
import heartEmptyIcon from '../assets/icons/heart_empty.svg';

const ProgramDetailModal = ({ 
  isOpen, 
  onClose, 
  programId,
  onLike,
  onApply
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const modalContentRef = useRef(null);
  const imageRef = useRef(null);


  // API 호출 함수
  const fetchProgramDetail = async (id) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/programs/${id}`);
      if (!response.ok) {
        throw new Error('프로그램 정보를 가져올 수 없습니다.');
      }
      const data = await response.json();
      setProgram(data);
    } catch (error) {
      console.error('프로그램 상세 정보 로딩 실패:', error);
      setProgram(null);
    } finally {
      setLoading(false);
    }
  };

  // 프로그램 상태만 업데이트하는 함수
  const updateProgramStatus = (id) => {
    if (!id || !program) return;
    
    const isLiked = likedPrograms.has(id);
    const isRegistered = registeredPrograms.has(id);
    
    console.log('상태 강제 업데이트:', { 
      programId: id, 
      contextLiked: isLiked,
      contextRegistered: isRegistered 
    });
    
    setProgram(prev => ({
      ...prev,
      likedByMe: isLiked,
      registeredByMe: isRegistered
    }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLikeClick = async () => {
    const result = await onLike?.(program);
    if (result?.success) {
      // 프로그램 찜 상태 즉시 업데이트
      setProgram(prev => ({
        ...prev,
        likedByMe: result.isLiked
      }));
    }
  };

  const handleApplyClick = async () => {
    const result = await onApply?.(program);
    if (result?.success && result?.isRegistered) {
      // 프로그램 상태 즉시 업데이트
      setProgram(prev => ({
        ...prev,
        registeredByMe: true
      }));
      
      setShowSuccessPopup(true);
      // 2초 후 팝업 자동 닫기
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
    }
  };

  // 대상학년 표시 형식 변경 (초, 중, 고 → 초등학생, 중학생, 고등학생)
  const formatTargetAudience = (audience) => {
    if (!audience) return '미정';
    return audience
      .replace('초', '초등학생')
      .replace('중', '중학생')
      .replace('고', '고등학생')
      .replace(',', ', ');
  };

const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    setShowOverlay(scrollTop > 30);
  }, []);

useEffect(() => {
    const modalContent = modalContentRef.current;
    if (modalContent && isOpen) {
      // 스크롤 위치 초기화
      modalContent.scrollTop = 0;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && programId) {
      if (!program || program.programId !== programId) {
        // 새로운 프로그램이거나 처음 열 때만 전체 데이터 로드
        fetchProgramDetail(programId);
      } else {
        // 같은 프로그램을 다시 열 때는 상태만 업데이트
        updateProgramStatus(programId);
      }
      // 모달이 열릴 때마다 오버레이 상태 초기화
      setShowOverlay(false);
    } else if (!isOpen) {
      // 모달이 닫힐 때는 프로그램 데이터를 유지 (상태만 업데이트하기 위해)
      setShowSuccessPopup(false);
    }
  }, [isOpen, programId]);

  // Context에서 찜/신청 상태 가져오기
  const { likedPrograms, registeredPrograms } = useProgramModal();
  
  // 프로그램 데이터와 Context 상태 동기화
  useEffect(() => {
    if (program && program.programId) {
      const isLiked = likedPrograms.has(program.programId);
      const isRegistered = registeredPrograms.has(program.programId);
      
      // Context 상태가 API 데이터와 다를 때만 업데이트
      if (program.likedByMe !== isLiked || program.registeredByMe !== isRegistered) {
        console.log('상태 동기화:', { 
          programId: program.programId, 
          apiLiked: program.likedByMe, 
          contextLiked: isLiked,
          apiRegistered: program.registeredByMe, 
          contextRegistered: isRegistered 
        });
        
        setProgram(prev => ({
          ...prev,
          likedByMe: isLiked,
          registeredByMe: isRegistered
        }));
      }
    }
  }, [program?.programId, program?.likedByMe, program?.registeredByMe, likedPrograms, registeredPrograms]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="program-detail-modal-backdrop" onClick={handleBackdropClick}>
        <div className="program-detail-modal">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div>로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="program-detail-modal-backdrop" onClick={handleBackdropClick}>
        <div className="program-detail-modal">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div>프로그램 정보를 불러올 수 없습니다.</div>
            <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px' }}>
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        <div 
          className="modal-content" 
          ref={modalContentRef}
          onScroll={handleScroll}
        >
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
              <h3>카테고리</h3>
              <p>{program.interestCategoryLabel || '미분류'}</p>
            </div>

            <div className="program-detail-modal__section">
              <h3>프로그램 유형</h3>
              <p>{program.programTypeLabel || '미정'}</p>
            </div>

            {program.targetAudience && (
              <div className="program-detail-modal__section">
                <h3>대상 학년</h3>
                <p>{formatTargetAudience(program.targetAudience)}</p>
              </div>
            )}

            {program.object && (
              <div className="program-detail-modal__section">
                <h3>목표</h3>
                <p>{program.object}</p>
              </div>
            )}

            {program.requiredHours && (
              <div className="program-detail-modal__section">
                <h3>체험 이수 시간</h3>
                <p>{program.requiredHours}</p>
              </div>
            )}

            {program.availHours && (
              <div className="program-detail-modal__section">
                <h3>체험 가능 시간</h3>
                <p>{program.availHours}</p>
              </div>
            )}

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
                {program.price === '0' || program.price === '무료'
                  ? '무료' 
                  : program.price ? `${parseInt(program.price).toLocaleString()}원` : '금액 미정'
                }
              </p>
            </div>
          </div>

          <div className="program-detail-modal__actions">
            <button 
              className={`program-detail-modal__like-btn ${program.likedByMe ? 'liked' : ''}`}
              onClick={handleLikeClick}
            >
              <img 
                src={program.likedByMe ? likeIcon : heartEmptyIcon} 
                alt="찜하기" 
                className="heart-icon"
              />
            </button>
            
            <button 
              className="program-detail-modal__apply-btn"
              onClick={handleApplyClick}
              disabled={program.registeredByMe}
            >
              {program.registeredByMe ? '신청 완료' : '신청하기'}
            </button>
          </div>
        </div>

        {/* 신청 완료 알림 - floating */}
        {showSuccessPopup && (
          <div className="success-notification">
            <div className="success-notification__content">
              <span className="success-notification__text">
                프로그램 신청이 완료되었습니다.
              </span>
              <button 
                className="success-notification__close"
                onClick={() => setShowSuccessPopup(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProgramDetailModal;