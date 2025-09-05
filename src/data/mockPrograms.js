// 체험 프로그램 목업 데이터
export const mockPrograms = [
  // IT 분야
  {
    program_id: 1,
    programTitle: "바이오 신약개발 체험",
    provider: "고려대학교 생명공학부",
    description: "신약개발 전 과정을 직접 체험해보며 바이오 업계의 실무를 경험할 수 있는 프로그램입니다.",
    programType: "현장직업체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 0,
    capacity: 20,
    startDate: "2025-10-15",
    endDate: "2025-10-16",
    relatedMajor: "생명공학",
    interestCategoryId: "IT",
    venueRegion: "서울 성북구",
    image: null,
    icon: "🧬",
    backgroundColor: "#A5B4FC"
  },
  {
    program_id: 2,
    programTitle: "게임 개발자 직업체험",
    provider: "넥슨",
    description: "게임 기획부터 개발까지 게임 개발의 전 과정을 체험할 수 있습니다.",
    programType: "직업실무체험형",
    targetAudience: "고등학생",
    eligibleRegion: "경기",
    price: 15000,
    capacity: 15,
    startDate: "2025-11-01",
    endDate: "2025-11-02",
    relatedMajor: "컴퓨터공학",
    interestCategoryId: "GAME",
    venueRegion: "경기 성남시",
    image: null,
    icon: "🎮",
    backgroundColor: "#C4B5FD"
  },
  {
    program_id: 3,
    programTitle: "AI 개발자 실무체험",
    provider: "카카오브레인",
    description: "인공지능 모델 개발과 서비스 적용까지의 전 과정을 체험합니다.",
    programType: "직업실무체험형",
    targetAudience: "고등학생",
    eligibleRegion: "경기",
    price: 20000,
    capacity: 12,
    startDate: "2025-10-20",
    endDate: "2025-10-22",
    relatedMajor: "컴퓨터공학",
    interestCategoryId: "IT",
    venueRegion: "경기 판교",
    image: null,
    icon: "🤖",
    backgroundColor: "#93C5FD"
  },
  {
    program_id: 4,
    programTitle: "웹 개발자 부트캠프",
    provider: "네이버",
    description: "프론트엔드부터 백엔드까지 웹 개발 전 과정을 실습합니다.",
    programType: "캠프형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 0,
    capacity: 30,
    startDate: "2025-11-15",
    endDate: "2025-11-17",
    relatedMajor: "컴퓨터공학",
    interestCategoryId: "IT",
    venueRegion: "서울 강남구",
    image: null,
    icon: "💻",
    backgroundColor: "#7DD3FC"
  },
  {
    program_id: 5,
    programTitle: "모바일 앱 개발 체험",
    provider: "토스",
    description: "iOS와 Android 앱 개발을 직접 체험해볼 수 있습니다.",
    programType: "학과체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 10000,
    capacity: 25,
    startDate: "2025-12-01",
    endDate: "2025-12-02",
    relatedMajor: "컴퓨터공학",
    interestCategoryId: "IT",
    venueRegion: "서울 강남구",
    image: null,
    icon: "📱",
    backgroundColor: "#86EFAC"
  },
  
  // 의료 분야
  {
    program_id: 6,
    programTitle: "의료진 체험 프로그램",
    provider: "서울대병원",
    description: "의사, 간호사 등 의료진의 업무를 직접 체험해볼 수 있는 기회입니다.",
    programType: "현장견학형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 0,
    capacity: 25,
    startDate: "2025-10-25",
    endDate: "2025-10-25",
    relatedMajor: "의학",
    interestCategoryId: "MEDICAL",
    venueRegion: "서울 종로구",
    image: null,
    icon: "🏥",
    backgroundColor: "#FCA5A5"
  },
  {
    program_id: 7,
    programTitle: "간호사 직업체험",
    provider: "연세세브란스병원",
    description: "간호사의 일상과 업무를 직접 체험해보는 프로그램입니다.",
    programType: "직업실무체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 5000,
    capacity: 20,
    startDate: "2025-11-05",
    endDate: "2025-11-05",
    relatedMajor: "간호학",
    interestCategoryId: "MEDICAL",
    venueRegion: "서울 서대문구",
    image: null,
    icon: "👩‍⚕️",
    backgroundColor: "#FDBA74"
  },
  {
    program_id: 8,
    programTitle: "치과의사 체험",
    provider: "서울대 치과병원",
    description: "치과 진료 과정과 치과의사의 업무를 체험합니다.",
    programType: "현장견학형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 10000,
    capacity: 15,
    startDate: "2025-11-12",
    endDate: "2025-11-12",
    relatedMajor: "치의학",
    interestCategoryId: "MEDICAL",
    venueRegion: "서울 종로구",
    image: null,
    icon: "🦷",
    backgroundColor: "#FCD34D"
  },
  {
    program_id: 9,
    programTitle: "응급의학과 체험",
    provider: "아산병원",
    description: "응급실에서의 의료진 활동을 직접 체험해보세요.",
    programType: "현장직업체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 0,
    capacity: 18,
    startDate: "2025-10-30",
    endDate: "2025-10-30",
    relatedMajor: "의학",
    interestCategoryId: "MEDICAL",
    venueRegion: "서울 송파구",
    image: null,
    icon: "🏥",
    backgroundColor: "#FCA5A5"
  },
  {
    program_id: 10,
    programTitle: "약사 직업탐구",
    provider: "서울약사회",
    description: "약사의 업무와 제약 산업에 대해 알아보는 프로그램입니다.",
    programType: "강연형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 5000,
    capacity: 40,
    startDate: "2025-11-20",
    endDate: "2025-11-20",
    relatedMajor: "약학",
    interestCategoryId: "MEDICAL",
    venueRegion: "서울 중구",
    image: null,
    icon: "💊",
    backgroundColor: "#86EFAC"
  },
  
  // 금융 분야
  {
    program_id: 11,
    programTitle: "금융 전문가 체험",
    provider: "KB국민은행",
    description: "은행업무와 금융상품 개발 과정을 체험할 수 있습니다.",
    programType: "직업실무체험형",
    targetAudience: "고등학생",
    eligibleRegion: "전국",
    price: 10000,
    capacity: 30,
    startDate: "2025-11-10",
    endDate: "2025-11-11",
    relatedMajor: "경제학",
    interestCategoryId: "FINANCE",
    venueRegion: "서울 중구",
    image: null,
    icon: "🏦",
    backgroundColor: "#5EEAD4"
  },
  {
    program_id: 12,
    programTitle: "투자 애널리스트 체험",
    provider: "삼성증권",
    description: "주식 분석과 투자 전략 수립 과정을 배웁니다.",
    programType: "직업실무체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 15000,
    capacity: 20,
    startDate: "2025-12-05",
    endDate: "2025-12-06",
    relatedMajor: "경제학",
    interestCategoryId: "FINANCE",
    venueRegion: "서울 영등포구",
    image: null,
    icon: "📈",
    backgroundColor: "#93C5FD"
  },
  {
    program_id: 13,
    programTitle: "보험 설계사 체험",
    provider: "삼성생명",
    description: "보험 상품 설계와 고객 상담 업무를 체험합니다.",
    programType: "현장직업체험형",
    targetAudience: "고등학생",
    eligibleRegion: "전국",
    price: 0,
    capacity: 35,
    startDate: "2025-11-25",
    endDate: "2025-11-25",
    relatedMajor: "경영학",
    interestCategoryId: "FINANCE",
    venueRegion: "서울 중구",
    image: null,
    icon: "🛡️",
    backgroundColor: "#DDD6FE"
  },
  {
    program_id: 14,
    programTitle: "핀테크 스타트업 체험",
    provider: "토스",
    description: "핀테크 서비스 개발과 금융 혁신을 체험합니다.",
    programType: "학과체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 20000,
    capacity: 15,
    startDate: "2025-12-10",
    endDate: "2025-12-11",
    relatedMajor: "경제학",
    interestCategoryId: "FINANCE",
    venueRegion: "서울 강남구",
    image: null,
    icon: "💳",
    backgroundColor: "#F9A8D4"
  },
  {
    program_id: 15,
    programTitle: "회계사 업무체험",
    provider: "삼일회계법인",
    description: "회계사의 일상 업무와 감사 과정을 체험합니다.",
    programType: "직업실무체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 10000,
    capacity: 25,
    startDate: "2025-11-18",
    endDate: "2025-11-19",
    relatedMajor: "회계학",
    interestCategoryId: "FINANCE",
    venueRegion: "서울 강남구",
    image: null,
    icon: "📄",
    backgroundColor: "#A7F3D0"
  },
  
  // 디자인 분야
  {
    program_id: 16,
    programTitle: "디자이너 워크샵",
    provider: "홍익대학교 미술대학",
    description: "UI/UX 디자인부터 제품 디자인까지 다양한 디자인 분야를 체험합니다.",
    programType: "학과체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 20000,
    capacity: 20,
    startDate: "2025-12-01",
    endDate: "2025-12-02",
    relatedMajor: "디자인학",
    interestCategoryId: "DESIGN",
    venueRegion: "서울 마포구",
    image: null,
    icon: "🎨",
    backgroundColor: "#FDBA74"
  },
  {
    program_id: 17,
    programTitle: "패션 디자이너 체험",
    provider: "한양대학교",
    description: "패션 디자인의 기초부터 트렌드 분석까지 체험합니다.",
    programType: "학과체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 25000,
    capacity: 18,
    startDate: "2025-11-28",
    endDate: "2025-11-29",
    relatedMajor: "패션디자인",
    interestCategoryId: "DESIGN",
    venueRegion: "서울 성동구",
    image: null,
    icon: "👗",
    backgroundColor: "#F9A8D4"
  },
  {
    program_id: 18,
    programTitle: "그래픽 디자인 실습",
    provider: "서울과학기술대학교",
    description: "포스터, 브랜딩 등 그래픽 디자인 실무를 체험합니다.",
    programType: "캠프형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 15000,
    capacity: 24,
    startDate: "2025-12-08",
    endDate: "2025-12-10",
    relatedMajor: "시각디자인",
    interestCategoryId: "DESIGN",
    venueRegion: "서울 노원구",
    image: null,
    icon: "🖥️",
    backgroundColor: "#C4B5FD"
  },
  {
    program_id: 19,
    programTitle: "제품 디자인 체험",
    provider: "현대자동차",
    description: "자동차 디자인 과정과 제품 디자인을 체험합니다.",
    programType: "현장직업체험형",
    targetAudience: "고등학생",
    eligibleRegion: "경기",
    price: 0,
    capacity: 16,
    startDate: "2025-11-08",
    endDate: "2025-11-09",
    relatedMajor: "산업디자인",
    interestCategoryId: "DESIGN",
    venueRegion: "경기 화성시",
    image: null,
    icon: "🚗",
    backgroundColor: "#7DD3FC"
  },
  {
    program_id: 20,
    programTitle: "인테리어 디자인 워크샵",
    provider: "건국대학교",
    description: "공간 디자인과 인테리어 기획을 체험해보세요.",
    programType: "학과체험형",
    targetAudience: "고등학생",
    eligibleRegion: "서울",
    price: 18000,
    capacity: 22,
    startDate: "2025-12-15",
    endDate: "2025-12-16",
    relatedMajor: "실내디자인",
    interestCategoryId: "DESIGN",
    venueRegion: "서울 광진구",
    image: null,
    icon: "🏠",
    backgroundColor: "#86EFAC"
  }
];

// 목업 데이터를 수백 개로 늘리기 위한 생성 함수
function generateMockPrograms(basePrograms, targetCount = 200) {
  const programs = [...basePrograms];
  const categories = ["IT", "MEDICAL", "FINANCE", "DESIGN", "EDUCATION", "SCIENCE", "ART", "ENGINEERING"];
  const programTypes = ["현장직업체험형", "직업실무체험형", "현장견학형", "학과체험형", "캠프형", "강연형", "대화형"];
  const regions = ["서울", "경기", "부산", "대구", "인천", "광주", "대전", "울산"];
  const venues = [
    "서울 강남구", "서울 강북구", "서울 서초구", "서울 송파구", "서울 마포구",
    "경기 성남시", "경기 수원시", "경기 고양시", "경기 화성시", "경기 판교",
    "부산 해운대구", "부산 부산진구", "대구 중구", "인천 남동구", "광주 서구"
  ];
  
  const companies = [
    "삼성전자", "LG전자", "네이버", "카카오", "SK하이닉스", "현대자동차", "KIA", "포스코",
    "한화", "두산", "롯데", "GS", "CJ", "신세계", "이마트", "쿠팡", "배달의민족",
    "서울대학교", "연세대학교", "고려대학교", "KAIST", "포스텍", "한양대학교", "성균관대학교",
    "서울아산병원", "세브란스병원", "삼성서울병원", "분당서울대병원"
  ];
  
  const majors = [
    "컴퓨터공학", "전자공학", "기계공학", "화학공학", "산업공학", "경영학", "경제학",
    "의학", "간호학", "약학", "치의학", "수의학", "생명공학", "화학", "물리학",
    "디자인학", "건축학", "도시계획", "교육학", "심리학", "사회학", "국문학"
  ];
  
  while (programs.length < targetCount) {
    const id = programs.length + 1;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const programType = programTypes[Math.floor(Math.random() * programTypes.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const venue = venues[Math.floor(Math.random() * venues.length)];
    const major = majors[Math.floor(Math.random() * majors.length)];
    
    const startMonth = Math.floor(Math.random() * 3) + 10; // 10, 11, 12월
    const startDay = Math.floor(Math.random() * 28) + 1;
    const duration = Math.floor(Math.random() * 3) + 1; // 1-3일
    
    const startDate = `2025-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
    const endDate = `2025-${startMonth.toString().padStart(2, '0')}-${(startDay + duration - 1).toString().padStart(2, '0')}`;
    
    const titles = {
      IT: [`소프트웨어 개발`, `데이터 분석`, `AI 머신러닝`, `웹 개발`, `모바일 앱 개발`, `사이버보안`],
      MEDICAL: [`의료진`, `간호사`, `약사`, `의료기기`, `의료 연구`, `재활치료사`],
      FINANCE: [`금융 분석`, `투자 전문가`, `보험 설계`, `회계사`, `재무 관리`, `핀테크`],
      DESIGN: [`UI/UX 디자인`, `그래픽 디자인`, `제품 디자인`, `패션 디자인`, `건축 디자인`, `브랜드 디자인`],
      EDUCATION: [`교사`, `교육과정 개발`, `온라인 교육`, `특수교육`, `교육행정`, `상담교사`],
      SCIENCE: [`연구원`, `실험 기술자`, `과학 커뮤니케이터`, `환경 과학자`, `생물학 연구`, `화학 분석`],
      ART: [`큐레이터`, `아티스트`, `무대 기술자`, `음향 엔지니어`, `영상 제작`, `문화 기획`],
      ENGINEERING: [`설계 엔지니어`, `품질 관리`, `생산 기술자`, `R&D 연구원`, `시설 관리`, `안전 관리자`]
    };
    
    const titleOptions = titles[category] || titles.IT;
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
    
    const icons = {
      IT: ["💻", "🖥️", "📱", "🤖", "⚡", "🔧", "🛠️", "📡", "💾", "🖨️"],
      MEDICAL: ["🏥", "👩‍⚕️", "👨‍⚕️", "💊", "🩺", "🧬", "💉", "🦷", "🧪", "🔬"],
      FINANCE: ["🏦", "📈", "💳", "💰", "📊", "💹", "🪙", "📋", "💼", "🛡️"],
      DESIGN: ["🎨", "👗", "🖥️", "🚗", "🏠", "✏️", "📐", "🖌️", "🎭", "📸"],
      EDUCATION: ["📚", "🎓", "👨‍🏫", "📝", "🏫", "💡", "🧠", "📖", "✍️", "🗣️"],
      SCIENCE: ["🔬", "⚗️", "🧪", "🌱", "🌍", "🔭", "⚡", "🧬", "🌿", "🦋"],
      ART: ["🎭", "🎨", "🎵", "🎬", "📷", "🖼️", "🎪", "🎹", "🎤", "🎸"],
      ENGINEERING: ["⚙️", "🔧", "🏗️", "🛠️", "⚡", "🏭", "🚀", "🔩", "📏", "🏢"]
    };
    
    const iconOptions = icons[category] || icons.IT;
    const icon = iconOptions[Math.floor(Math.random() * iconOptions.length)];
    
    const backgroundColors = {
      IT: ["#A5B4FC", "#C4B5FD", "#93C5FD", "#7DD3FC", "#86EFAC", "#FCA5A5", "#FDBA74"],
      MEDICAL: ["#FCA5A5", "#FDBA74", "#FCD34D", "#86EFAC", "#5EEAD4", "#F9A8D4", "#F4A460"],
      FINANCE: ["#5EEAD4", "#93C5FD", "#DDD6FE", "#F9A8D4", "#A7F3D0", "#7DD3FC", "#FDBA74"],
      DESIGN: ["#FDBA74", "#F9A8D4", "#C4B5FD", "#7DD3FC", "#86EFAC", "#FCA5A5", "#FCD34D"],
      EDUCATION: ["#93C5FD", "#C4B5FD", "#86EFAC", "#FDBA74", "#F9A8D4", "#5EEAD4", "#FCD34D"],
      SCIENCE: ["#86EFAC", "#5EEAD4", "#93C5FD", "#C4B5FD", "#FDBA74", "#FCA5A5", "#FCD34D"],
      ART: ["#F9A8D4", "#FDBA74", "#C4B5FD", "#FCA5A5", "#FCD34D", "#86EFAC", "#7DD3FC"],
      ENGINEERING: ["#7DD3FC", "#A7F3D0", "#DDD6FE", "#93C5FD", "#FCA5A5", "#FDBA74", "#86EFAC"]
    };
    
    const colorOptions = backgroundColors[category] || backgroundColors.IT;
    const backgroundColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    
    programs.push({
      program_id: id,
      programTitle: `${title} 체험 프로그램`,
      provider: company,
      description: `${title} 분야의 실무를 직접 체험하고 전문가와 대화할 수 있는 기회입니다. ${category} 분야에 관심이 있는 학생들에게 추천합니다.`,
      programType: programType,
      targetAudience: "고등학생",
      eligibleRegion: region,
      price: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 30000) + 5000,
      capacity: Math.floor(Math.random() * 30) + 10,
      startDate: startDate,
      endDate: endDate,
      relatedMajor: major,
      interestCategoryId: category,
      venueRegion: venue,
      image: null,
      icon: icon,
      backgroundColor: backgroundColor
    });
  }
  
  return programs;
}

// 목업 데이터 생성 (기본 20개에서 200개로 확장)
export const expandedMockPrograms = generateMockPrograms(mockPrograms, 200);