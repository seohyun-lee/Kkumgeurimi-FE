import { CATEGORY_DETAILS } from '../utils/category.js';

export const careerService = {
  // 체험한 프로그램 목록 조회 (관심사 버블 생성용)
  async getExperiencedPrograms(token) {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      
      console.log("🔍 Career API 요청 시작:", {
        url: `${API_BASE}/careermap`,
        token: token ? "토큰 있음" : "토큰 없음"
      });
      
      const response = await fetch(`${API_BASE}/careermap`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      console.log("📡 Career API 응답:", {
        status: response.status,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Career API 에러:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const programs = await response.json();
      console.log("✅ Career 프로그램 데이터:", programs);
      
      return programs;
    } catch (error) {
      console.error("🚨 Career API 실패:", error);
      
      // 폴백 더미 데이터
      const fallbackData = [
        {
          programId: "1",
          title: "바리스타 체험 교실 (에스프레소 추출)",
          description: null,
          interestCategoryId: 18
        },
        {
          programId: "2", 
          title: "녹색에너지를 탐색!하다",
          description: null,
          interestCategoryId: 29
        }
      ];
      
      console.log("🔧 Career 더미 데이터 사용:", fallbackData);
      return fallbackData;
    }
  },

  // interestCategoryId를 버블 설정으로 변환
  mapCategoryToBubble(categoryId, programs) {
    // 카테고리별 버블 설정 (위치, 색상, 크기)
    const categoryConfig = {
      1: { x: -150, y: -100, size: 'large' },
      2: { x: 200, y: -80, size: 'large' },
      11: { x: -100, y: 150, size: 'large' },
      12: { x: 250, y: 100, size: 'large' },
      18: { x: -200, y: 50, size: 'large' },
      29: { x: 100, y: -150, size: 'large' },
      // 추가 카테고리들...
    };

    const categoryInfo = CATEGORY_DETAILS[categoryId];
    const positionConfig = categoryConfig[categoryId];
    
    const config = {
      name: categoryInfo?.name || `카테고리 ${categoryId}`,
      color: categoryInfo?.color || '#ddd',
      x: positionConfig?.x || Math.random() * 400 - 200,
      y: positionConfig?.y || Math.random() * 300 - 150,
      size: positionConfig?.size || 'large'
    };

    // 해당 카테고리의 프로그램 개수에 따라 버블 크기 조정
    const programCount = programs.filter(p => p.interestCategoryId === categoryId).length;
    if (programCount >= 3) config.size = 'large';
    else if (programCount >= 2) config.size = 'medium';
    else config.size = 'small';

    return {
      id: `category-${categoryId}`,
      categoryId,
      name: config.name,
      size: config.size,
      color: config.color,
      x: config.x,
      y: config.y,
      weight: programCount * 20 + 40,
      type: 'interest'
    };
  },

  // 프로그램을 작은 버블로 변환
  mapProgramToBubble(program, parentBubble) {
    // 부모 버블 주변에 작은 버블들 배치
    const angle = Math.random() * 2 * Math.PI;
    const distance = 80 + Math.random() * 40;
    
    return {
      id: `program-${program.programId}`,
      programId: program.programId,
      name: program.title.length > 10 ? program.title.substring(0, 10) + '...' : program.title,
      fullTitle: program.title,
      size: 'small',
      color: this.lightenColor(parentBubble.color, 0.3),
      x: parentBubble.x + Math.cos(angle) * distance,
      y: parentBubble.y + Math.sin(angle) * distance,
      weight: 25,
      parentId: parentBubble.id,
      type: 'program'
    };
  },

  // 색상을 밝게 만드는 헬퍼 함수
  lightenColor(color, factor) {
    // 간단한 색상 변환 (실제로는 더 정교한 색상 계산이 필요할 수 있음)
    const colors = {
      '#74b9ff': '#a8d4ff',
      '#0984e3': '#4da3e8',
      '#fd79a8': '#fea3c2',
      '#fdcb6e': '#fedd94',
      '#00b894': '#4dd0b8',
      '#00cec9': '#4dded8'
    };
    return colors[color] || '#e0e0e0';
  },

  // API 데이터를 버블 데이터로 변환
  async generateBubbleData(token) {
    try {
      const programs = await this.getExperiencedPrograms(token);
      
      // 카테고리별로 그룹화
      const categoryGroups = {};
      programs.forEach(program => {
        const categoryId = program.interestCategoryId;
        if (!categoryGroups[categoryId]) {
          categoryGroups[categoryId] = [];
        }
        categoryGroups[categoryId].push(program);
      });

      // 관심사 버블 생성 (큰 버블)
      const interestBubbles = Object.keys(categoryGroups).map(categoryId => 
        this.mapCategoryToBubble(parseInt(categoryId), programs)
      );

      // 프로그램 버블 생성 (작은 버블)
      const programBubbles = [];
      Object.entries(categoryGroups).forEach(([categoryId, categoryPrograms]) => {
        const parentBubble = interestBubbles.find(b => b.categoryId === parseInt(categoryId));
        if (parentBubble) {
          categoryPrograms.forEach(program => {
            programBubbles.push(this.mapProgramToBubble(program, parentBubble));
          });
        }
      });

      return {
        interests: interestBubbles,
        programs: programBubbles,
        allBubbles: [...interestBubbles, ...programBubbles]
      };
    } catch (error) {
      console.error("버블 데이터 생성 실패:", error);
      return { interests: [], programs: [], allBubbles: [] };
    }
  }
};