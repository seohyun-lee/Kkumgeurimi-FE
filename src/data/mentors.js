export const MENTORS = [
  {
    id: 'content-planner',
    name: '기획자',
    description: '어떤 이야기를 담을지 아이디어를 내고 기획하는 일을 합니다.',
    avatar: '/mock_image_url/korean_man_1.jpeg',
    expertise: ['아이디어 기획', '이야기 구성', '사용자 공감'],
  },
  {
    id: 'marketing',
    name: '마케터',
    description: '사람들이 어떤 제품이나 서비스를 좋아할지 조사하고, 재미있게 알리는 방법을 찾습니다.',
    avatar: '/mock_image_url/korean_woman_2.jpeg',
    expertise: ['광고 아이디어', '브랜드 만들기', '소셜미디어 활용'],
  },
  {
    id: 'developer',
    name: '개발자',
    description: '앱이나 웹사이트, 게임 같은 프로그램을 직접 만들고 문제를 해결합니다.',
    avatar: '/mock_image_url/korean_man_2.jpeg',
    expertise: ['앱 만들기', '게임 제작', '코딩'],
  },
  {
    id: 'data-scientist',
    name: '데이터 사이언티스트',
    description: '많은 데이터를 분석해서 “사람들이 어떤 영상을 좋아할까?” 같은 문제의 답을 찾는 일을 합니다.',
    avatar: '/mock_image_url/korean_woman_1.jpeg',
    expertise: ['데이터 분석', '문제 해결', '패턴 찾기'],
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