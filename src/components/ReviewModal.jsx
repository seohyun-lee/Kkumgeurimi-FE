import React, { useState } from 'react';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, program, onSubmit }) => {
  const [reviewData, setReviewData] = useState({
    score: 5,
    message: '',
    experienceDate: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (score) => {
    setReviewData(prev => ({ ...prev, score }));
  };

  const handleMessageChange = (e) => {
    setReviewData(prev => ({ ...prev, message: e.target.value }));
  };

  const handleDateChange = (e) => {
    setReviewData(prev => ({ ...prev, experienceDate: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.message.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(program.programId, reviewData);
      onClose();
      // 폼 초기화
      setReviewData({
        score: 5,
        message: '',
        experienceDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-backdrop" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        <div className="review-modal__header">
          <h2 className="review-modal__title">리뷰 작성하기</h2>
          <button className="review-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="review-modal__program-info">
          <h3 className="review-modal__program-title">{program?.programTitle}</h3>
          <p className="review-modal__program-provider">{program?.provider}</p>
        </div>

        <form className="review-modal__form" onSubmit={handleSubmit}>
          {/* 별점 */}
          <div className="review-modal__field review-modal__field--stars">
            <label className="review-modal__label">평점</label>
            <div className="review-modal__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`review-modal__star ${star <= reviewData.score ? 'active' : ''}`}
                  onClick={() => handleScoreChange(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* 체험 날짜 */}
          <div className="review-modal__field">
            <label className="review-modal__label">체험 날짜</label>
            <input
              type="date"
              className="review-modal__date-input"
              value={reviewData.experienceDate}
              onChange={handleDateChange}
              required
            />
          </div>

          {/* 리뷰 내용 */}
          <div className="review-modal__field">
            <label className="review-modal__label">리뷰 내용</label>
            <textarea
              className="review-modal__textarea"
              placeholder="프로그램에 대한 솔직한 후기를 남겨주세요."
              value={reviewData.message}
              onChange={handleMessageChange}
              rows={4}
              required
            />
          </div>

          {/* 버튼 */}
          <div className="review-modal__actions">
            <button
              type="button"
              className="review-modal__cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="review-modal__submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '작성 중...' : '리뷰 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
