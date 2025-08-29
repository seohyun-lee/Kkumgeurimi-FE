// 멘토 데이터 - Career 페이지와 Assistant 페이지에서 공통 사용
export const MENTORS = [
  {
    id: 'content-planner',
    name: '콘텐츠 기획자',
    description: '콘텐츠 기획자는 사용자에게 전달할 정보나 이야기를 목적에 맞게 설계하는 역할을 합니다.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1cd?w=150&h=150&fit=crop&crop=face',
    expertise: ['콘텐츠 전략', '사용자 리서치', '스토리텔링'],
    experience: '5년차',
    company: '네이버',
  },
  {
    id: 'marketing-specialist',
    name: '마케팅 전문가',
    description: '마케팅은 고객의 니즈를 파악하고 제품/서비스와 연결시키는 다리 역할을 합니다.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    expertise: ['디지털 마케팅', '브랜드 전략', '데이터 분석'],
    experience: '7년차',
    company: '카카오',
  },
  {
    id: 'ux-ui-designer',
    name: 'UX/UI 디자이너',
    description: '디자인은 단순히 예쁘게 만드는 것이 아니라 사용자의 문제를 해결하는 것입니다.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    expertise: ['사용자 경험 설계', '인터페이스 디자인', '프로토타이핑'],
    experience: '4년차',
    company: 'LINE',
  },
  {
    id: 'fullstack-developer',
    name: '풀스택 개발자',
    description: '개발은 논리적 사고와 창의성이 만나는 분야입니다. 끊임없이 새로운 기술을 학습하며 문제를 해결해나가는 재미가 있어요.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    expertise: ['React', 'Node.js', '클라우드 아키텍처'],
    experience: '6년차',
    company: '토스',
  },
  {
    id: 'data-scientist',
    name: '데이터 사이언티스트',
    description: '데이터에서 인사이트를 발견하고 비즈니스 문제를 해결하는 역할을 담당합니다.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    expertise: ['머신러닝', '데이터 분석', '통계'],
    experience: '5년차',
    company: '쿠팡',
  },
  {
    id: 'product-manager',
    name: '프로덕트 매니저',
    description: '제품의 전체적인 방향성을 설정하고 다양한 팀과 협업하여 사용자 가치를 창출합니다.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    expertise: ['제품 전략', '애자일 방법론', '사용자 분석'],
    experience: '8년차',
    company: '배달의민족',
  },
];

// Career 페이지용 변환 함수
export function getMentorsForCareer() {
  return MENTORS.map(mentor => ({
    ...mentor,
    // Career 페이지에서 필요한 추가 속성들
    isClickable: true,
  }));
}

// Assistant 페이지용 변환 함수 
export function getMentorsForAssistant() {
  return MENTORS.map(mentor => ({
    name: mentor.name,
    description: mentor.description,
    avatar: mentor.avatar,
    // Assistant에서 profession으로 사용
    profession: mentor.name,
  }));
}