import React from 'react';
import './ProgramCardBasic.css';

const ProgramCardBasic = ({ 
  title = "'공간인간' 유현준 교수와 함께 하는 진로콘서트",
  organization = "서구진로교육지원센터",
  date = "2025-08-06 ~ 2025-12-31",
  category = "카테고리",
  tags = ["체험처", "무료"],
  imageUrl,
  className = '',
  onClick,
  ...props 
}) => {
  return (
    <div
      className={`program-card-basic ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* 이미지 영역 + 카테고리 */}
      <div className="program-card-basic__image">
        <span className="program-card-basic__category">{category}</span>
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="program-card-basic__placeholder">
            <span>이미지</span>
          </div>
        )}
      </div>
      
      {/* 카드 콘텐츠 */}
      <div className="program-card-basic__content">
        <h3 className="program-card-basic__title">{title}</h3>
        <p className="program-card-basic__organization">{organization}</p>
        <div className="program-card-basic__date">{date}</div>
        
        {/* 태그들 */}
        <div className="program-card-basic__tags">
          {tags.map((tag, index) => (
            <span key={index} className="program-card-basic__tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramCardBasic;
