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
      
      // 더미 응답 반환 (API 실패시)
      return {
        answer: `죄송합니다. 현재 채팅 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."`,
        topMatches: [],
        success: false,
        error: error.message
      };
    }
  }
};