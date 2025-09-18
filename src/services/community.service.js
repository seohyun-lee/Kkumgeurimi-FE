import http from './http';

const communityService = {
  // 게시글 목록 조회
  getPosts: async (page = 0, size = 10) => {
    try {
      const response = await http.get(`/posts?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      throw error;
    }
  },

  // 게시글 상세 조회
  getPost: async (postId) => {
    try {
      const response = await http.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      throw error;
    }
  },

  // 게시글 작성
  createPost: async (postData) => {
    try {
      const response = await http.post('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      throw error;
    }
  },

  // 게시글 삭제
  deletePost: async (postId) => {
    try {
      await http.delete(`/posts/${postId}`);
      return true;
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw error;
    }
  },

  // 좋아요 토글
  toggleLike: async (postId) => {
    try {
      await http.post(`/posts/${postId}/like`);
      return true;
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      throw error;
    }
  },

  // 댓글 작성
  createComment: async (postId, content) => {
    try {
      const response = await http.post(`/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw error;
    }
  },

  // 댓글 삭제
  deleteComment: async (commentId) => {
    try {
      await http.delete(`/comments/${commentId}`);
      return true;
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw error;
    }
  }
};

export default communityService;