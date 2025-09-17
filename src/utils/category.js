/**
 * 카테고리 관련 유틸리티 함수들
 */

// 카테고리 ID와 이름 매핑
export const CATEGORY_MAPPING = {
  1: '과학기술',
  2: 'IT개발', 
  11: '예술디자인',
  12: '체육',
  18: '서비스업',
  29: '환경에너지'
};

// 카테고리 ID와 상세 정보 매핑 (career.service.js에서 사용하는 것과 통합)
export const CATEGORY_DETAILS = {
  1: { 
    name: '과학기술', 
    color: '#74b9ff', 
    jobTitle: '과학기술 연구원',
    description: '과학 연구와 기술 개발을 통해 인류의 발전에 기여하는 전문가'
  },
  2: { 
    name: 'IT개발', 
    color: '#0984e3', 
    jobTitle: 'IT 개발자',
    description: '소프트웨어와 시스템을 개발하여 디지털 혁신을 이끄는 전문가'
  },
  11: { 
    name: '예술디자인', 
    color: '#fd79a8', 
    jobTitle: '예술 디자이너',
    description: '창의적인 아이디어로 아름다운 작품과 디자인을 만드는 전문가'
  },
  12: { 
    name: '체육', 
    color: '#fdcb6e', 
    jobTitle: '체육 지도사',
    description: '건강한 신체 활동을 통해 사람들의 삶의 질을 향상시키는 전문가'
  },
  18: { 
    name: '서비스업', 
    color: '#00b894', 
    jobTitle: '서비스업 전문가',
    description: '고객의 만족과 편의를 위해 다양한 서비스를 제공하는 전문가'
  },
  29: { 
    name: '환경에너지', 
    color: '#00cec9', 
    jobTitle: '환경에너지 전문가',
    description: '지속가능한 미래를 위해 환경과 에너지 문제를 해결하는 전문가'
  }
};

/**
 * 카테고리 ID를 카테고리 이름으로 변환
 * @param {number} categoryId - 카테고리 ID
 * @returns {string} 카테고리 이름
 */
export const getCategoryName = (categoryId) => {
  return CATEGORY_MAPPING[categoryId] || '기타';
};

/**
 * 카테고리 ID를 직업 제목으로 변환
 * @param {number} categoryId - 카테고리 ID
 * @returns {string} 직업 제목
 */
export const getCategoryJobTitle = (categoryId) => {
  return CATEGORY_DETAILS[categoryId]?.jobTitle || `분야 ${categoryId} 전문가`;
};

/**
 * 카테고리 ID를 직업 설명으로 변환
 * @param {number} categoryId - 카테고리 ID
 * @returns {string} 직업 설명
 */
export const getCategoryDescription = (categoryId) => {
  return CATEGORY_DETAILS[categoryId]?.description || `${categoryId}번 분야의 전문적인 업무를 담당하는 직업입니다.`;
};

/**
 * 카테고리 ID를 색상으로 변환 (버블 차트 등에서 사용)
 * @param {number} categoryId - 카테고리 ID
 * @returns {string} 색상 코드
 */
export const getCategoryColor = (categoryId) => {
  return CATEGORY_DETAILS[categoryId]?.color || '#ddd';
};

/**
 * 카테고리의 전체 정보를 반환
 * @param {number} categoryId - 카테고리 ID
 * @returns {object} 카테고리 상세 정보
 */
export const getCategoryInfo = (categoryId) => {
  return CATEGORY_DETAILS[categoryId] || {
    name: '기타',
    color: '#ddd',
    jobTitle: `분야 ${categoryId} 전문가`,
    description: `${categoryId}번 분야의 전문적인 업무를 담당하는 직업입니다.`
  };
};
