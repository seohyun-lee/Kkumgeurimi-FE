import React from "react";
import "./ProgramCard.css"; // 필요시 따로 스타일 파일
import { FaHeart } from "react-icons/fa";

export default function ProgramCard({ program, isLiked, onLike, onClick }) {
  return (
    <article
      className="card"
      onClick={() => onClick?.(program)}
    >
      <div className="card__img">
        <button
          className={`heart-btn ${isLiked ? "liked" : ""}`}
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          onClick={(e) => {
              e.stopPropagation();
              onLike?.(program.program_id);
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
        <h3 className="card__title">{program.title}</h3>
        <div className="card__provider">{program.provider}</div>

        {/* ✅ 기간 표시 텍스트) */}
        <div className="card__period">
          <span>{program.start_date} ~ {program.end_date}</span>
        </div>

        <div className="card__meta">
          <div className="meta">
            <i className="fas fa-map-marker-alt" />
            <span>{program.venue_region}</span>
          </div>
          <div className="meta">
            <i className="fas fa-users" />
            <span>{program.target_audience}</span>
          </div>
        </div>

        <div className="card__tags">
          <span className="tag">{program.field_category}</span>
          {program.price === "무료" ? (
            <span className="tag tag--free">무료</span>
          ) : (
            <span className="tag">{program.price}</span>
          )}
        </div>
      </div>
    </article>
  );
}
