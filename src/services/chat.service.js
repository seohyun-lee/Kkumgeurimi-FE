export const chatService = {
  async sendMessage({ query, profession = '학생', userId = null }) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_AI_SERVER_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          ...(userId && { user_id: userId }),
          profession,
          query
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        answer: data.answer_md,
        topMatches: data.top_matches || [],
        success: true
      };
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Mock 응답 반환 (API 실패시)
      const mockResponses = [
        {
          answer: `안녕하세요! ${profession}님의 질문에 대해 답변드리겠습니다. **${query}**에 관련된 체험 프로그램들을 추천해드릴 수 있어요. \n\n먼저 어떤 분야에 가장 관심이 있으신지 알려주시면, 더 맞춤형 추천을 해드릴 수 있습니다.`,
          topMatches: [
            { id: 1, title: "바이오 신약개발 체험", description: "신약개발 전 과정을 직접 체험해보는 프로그램", score: 0.95 },
            { id: 2, title: "게임 개발자 직업체험", description: "게임 기획부터 개발까지 전 과정 체험", score: 0.88 },
            { id: 3, title: "의료진 체험 프로그램", description: "의사, 간호사 등 의료진 업무 체험", score: 0.82 }
          ]
        },
        {
          answer: `좋은 질문이네요! 진로 선택은 정말 중요한 결정이에요. **${query}**와 관련해서 몇 가지 조언을 드릴게요:\n\n1. **자신의 흥미와 적성을 파악**하세요\n2. **다양한 체험 프로그램**에 참여해보세요\n3. **현직자와의 대화** 기회를 만들어보세요\n\n어떤 분야에 특히 관심이 있으신가요?`,
          topMatches: []
        },
        {
          answer: `네, 맞습니다! ${profession}으로서 **${query}**에 대해 관심을 가지시는 것은 정말 좋은 생각이에요.\n\n제가 추천하는 방법은:\n- 관련 **체험 프로그램**에 먼저 참여해보시는 것\n- 해당 분야 **전문가들과 네트워킹**하기\n- **실무 경험**을 쌓을 수 있는 기회 찾기\n\n구체적으로 어떤 부분이 가장 궁금하신가요?`,
          topMatches: [
            { id: 4, title: "금융 전문가 체험", description: "은행업무와 금융상품 개발 과정 체험", score: 0.91 },
            { id: 5, title: "디자이너 워크샵", description: "UI/UX부터 제품 디자인까지 다양한 분야 체험", score: 0.85 }
          ]
        }
      ];

      // 랜덤하게 mock 응답 선택
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return {
        answer: randomResponse.answer,
        topMatches: randomResponse.topMatches,
        success: false,
        error: error.message
      };
    }
  }
};