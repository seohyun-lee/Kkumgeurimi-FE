import React from "react";
import "./ProgramCard.css"; // 필요시 따로 스타일 파일
import { FaHeart } from "react-icons/fa";

export default function ProgramCard({ program, isLiked, onLike, onClick }) {
  // API 응답 필드명 매핑
  const programId = program.programId || program.program_id;
  const title = program.programTitle || program.title;
  const provider = program.provider;
  const startDate = program.startDate || program.start_date;
  const endDate = program.endDate || program.end_date;
  const venueRegion = program.venueRegion || program.eligibleRegion || program.venue_region;
  const targetAudience = program.targetAudience || program.target_audience;
  const price = program.price;
  const imageUrl = program.imageUrl;
  const relatedMajor = program.relatedMajor || program.field_category;

  return (
    <article
      className="card"
      onClick={() => onClick?.(program)}
    >
      <div className="card__img">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <button
          className={`heart-btn ${isLiked ? "liked" : ""}`}
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          onClick={(e) => {
              e.stopPropagation();
              onLike?.(programId);
          }}
          >
          <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
              <path
              d="M10 16.5C10 16.5 2 11 2 6C2 3.79086 3.79086 2 6 2C7.5 2 9 3 10 4C11 3 12.5 2 14 2C16.2091 2 18 3.79086 18 6C18 11 10 16.5 10 16.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill={isLiked ? "currentColor" : "none"}
              />
          </svg>
        </button>

      </div>

      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <div className="card__provider">{provider}</div>

        {/* 기간 표시 */}
        <div className="card__period">
          <span>{startDate} ~ {endDate}</span>
        </div>

        <div className="card__meta">
          <div className="meta">
            <i className="fas fa-map-marker-alt" />
            <span>{venueRegion}</span>
          </div>
          <div className="meta">
            <i className="fas fa-users" />
            <span>{targetAudience}</span>
          </div>
        </div>

        <div className="card__tags">
          <span className="tag">{relatedMajor}</span>
          {price === "0" || price === 0 ? (
            <span className="tag tag--free">무료</span>
          ) : (
            <span className="tag">{Number(price).toLocaleString()}원</span>
          )}
        </div>
      </div>
    </article>
  );
}
