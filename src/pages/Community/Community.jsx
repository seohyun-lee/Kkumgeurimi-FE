import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './Community.css';

const Community = () => {
  const [currentView, setCurrentView] = useState('main'); // main, write, detail
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [selectedWriteCategory, setSelectedWriteCategory] = useState('진로·적성');
  const [posts, setPosts] = useState([
    {
      id: 1,
      category: '진로·적성',
      title: 'IT 진로에 관심있는데 어떤 프로그램 추천하시나요?',
      content: '안녕하세요! 고2 학생입니다. 최근에 프로그래밍에 관심이 생겨서 IT 쪽으로 진로를 생각하고 있어요. 혹시 경험해보신 프로그램이나 추천할만한 것들이 있을까요? 특히 코딩 입문자도 들을 수 있는 것들로요!',
      author: '꿈나무22',
      date: '2025.09.16',
      likes: 34,
      comments: 18,
      views: 156,
      hashtag: '#IT #프로그래밍 #진로고민',
      imageUrl: null
    },
    {
      id: 2,
      category: '체험후기',
      title: '청소년 창업 멘토링 프로그램 후기 (강추!)',
      content: '지난달에 참여했던 청소년 창업 멘토링 프로그램 너무 좋았어요! 실제 창업가분들이 와서 강의해주시고, 팀 프로젝트도 하고... 비즈니스 모델 만들어보는 것도 재밌었습니다. 창업에 관심있으신 분들께 진짜 추천드려요!',
      author: '스타트업드림',
      date: '2025.09.15',
      likes: 42,
      comments: 23,
      views: 203,
      hashtag: '#창업 #멘토링 #체험후기',
      imageUrl: null
    },
    {
      id: 3,
      category: '진로·적성',
      title: '의대 vs 간호대... 진로 선택 도움 부탁드려요',
      content: '고3인데 아직도 의대와 간호대 사이에서 고민이 많아요. 둘 다 의료 분야긴 하지만 너무 다르잖아요ㅠㅠ 혹시 관련 프로그램 참여해보신 분 있나요? 병원 체험이나 의료진 멘토링 같은 거 있으면 정말 도움이 될 것 같아요.',
      author: '미래의사',
      date: '2025.09.14',
      likes: 28,
      comments: 31,
      views: 142,
      hashtag: '#의대 #간호대 #진로선택',
      imageUrl: null
    },
    {
      id: 4,
      category: '자유소통',
      title: '진로 박람회 같이 갈 사람 구해요~',
      content: '다음주 토요일에 COEX에서 하는 청소년 진로 박람회 혼자 가기 심심해서요ㅎㅎ 같이 가실 분 있나요? 특히 미디어, 예술 쪽에 관심있으신 분이면 더 좋을 것 같아요! 댓글 달아주세요~',
      author: '아트러버',
      date: '2025.09.13',
      likes: 15,
      comments: 12,
      views: 89,
      hashtag: '#진로박람회 #같이가요 #미디어예술',
      imageUrl: null
    },
    {
      id: 5,
      category: '고민상담',
      title: '부모님과 진로 의견이 달라서 스트레스에요...',
      content: '저는 디자인 쪽에 관심이 많은데 부모님은 안정적인 직업을 원하세요. 그래서 요즘 진로 상담 프로그램을 찾아보고 있는데 부모님이랑 같이 들을 수 있는 것도 있을까요? 객관적인 조언을 들어보고 싶어요.',
      author: '디자인꿈나무',
      date: '2025.09.12',
      likes: 67,
      comments: 45,
      views: 234,
      hashtag: '#진로상담 #부모님갈등 #디자인',
      imageUrl: null
    },
    {
      id: 6,
      category: '체험후기',
      title: '한국잡월드 직업체험 다녀왔어요!',
      content: '친구들과 한국잡월드에 다녀왔는데 생각보다 너무 재밌었어요! 특히 방송국 PD 체험이랑 요리사 체험이 인상깊었습니다. 직업을 직접 체험해볼 수 있어서 진로에 대해 더 구체적으로 생각해볼 수 있었어요. 추천!',
      author: '체험러',
      date: '2025.09.11',
      likes: 38,
      comments: 16,
      views: 167,
      hashtag: '#한국잡월드 #직업체험 #PD #요리사',
      imageUrl: null
    },
    {
      id: 7,
      category: '진로·적성',
      title: '심리학과 vs 사회복지학과 진로 프로그램 추천',
      content: '사람을 도와주는 일에 관심이 많아서 심리학과나 사회복지학과를 생각하고 있어요. 혹시 이 분야 관련 진로 프로그램이나 멘토링 참여해보신 분 계신가요? 실제로 어떤 일을 하는지 궁금해요!',
      author: '도움이되고싶어',
      date: '2025.09.10',
      likes: 29,
      comments: 19,
      views: 198,
      hashtag: '#심리학 #사회복지 #멘토링',
      imageUrl: null
    },
    {
      id: 8,
      category: '자유소통',
      title: '진로 적성검사 결과가 매번 달라요 ㅠㅠ',
      content: '여러 사이트에서 진로 적성검사를 해봤는데 결과가 매번 달라서 혼란스러워요... 혹시 정확하고 믿을만한 진로 검사나 상담 프로그램 아시는 분 있나요? 돈을 내더라도 제대로 된 걸로 받아보고 싶어요.',
      author: '혼란중',
      date: '2025.09.09',
      likes: 52,
      comments: 27,
      views: 301,
      hashtag: '#적성검사 #진로상담 #추천',
      imageUrl: null
    },
    {
      id: 9,
      category: '체험후기',
      title: '대학교 전공체험 프로그램 정말 도움됐어요',
      content: '서울대에서 하는 고교생 전공체험 프로그램에 참여했는데 진짜 좋았어요! 실제 대학 강의도 들어보고 선배들이랑 이야기도 나누고... 전공에 대한 막연한 생각이 구체적으로 바뀌었어요. 각 대학교마다 이런 프로그램들이 있더라고요.',
      author: '대학탐방러',
      date: '2025.09.08',
      likes: 71,
      comments: 33,
      views: 278,
      hashtag: '#대학체험 #전공탐색 #서울대',
      imageUrl: null
    },
    {
      id: 10,
      category: '고민상담',
      title: '문과인데 이공계로 전향하고 싶어요',
      content: '고2 문과생인데 최근에 데이터 사이언스에 관심이 생겼어요. 근데 수학을 너무 못해서... 혹시 비슷한 경험 있으신 분이나 관련 진로 프로그램 아시는 분 계신가요? 늦지 않았을까요?',
      author: '데이터꿈나무',
      date: '2025.09.07',
      likes: 44,
      comments: 38,
      views: 189,
      hashtag: '#문과 #이공계전향 #데이터사이언스',
      imageUrl: null
    },
    {
      id: 11,
      category: '진로·적성',
      title: '교사가 되고 싶은데 어떤 준비를 해야 할까요?',
      content: '초등학교 선생님이 되는 게 꿈이에요! 교육대학교 입시 준비도 해야 하고... 혹시 교사 체험 프로그램이나 교육 관련 봉사활동 추천해주실 수 있나요? 미리 경험해보고 싶어서요.',
      author: '미래선생님',
      date: '2025.09.06',
      likes: 36,
      comments: 24,
      views: 145,
      hashtag: '#교사 #교육대 #봉사활동',
      imageUrl: null
    },
    {
      id: 12,
      category: '자유소통',
      title: '온라인 진로 프로그램도 효과가 있을까요?',
      content: '요즘 코로나 때문에 온라인으로 하는 진로 프로그램들이 많더라고요. 직접 만나서 하는 것보다 효과가 떨어질까 봐 걱정인데... 온라인 프로그램 참여해보신 분들 후기 좀 들려주세요!',
      author: '온라인러닝',
      date: '2025.09.05',
      likes: 22,
      comments: 15,
      views: 167,
      hashtag: '#온라인 #진로프로그램 #후기',
      imageUrl: null
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    hashtag: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [isEditingHashtag, setIsEditingHashtag] = useState(false);
  const fileInputRef = React.useRef(null);

  const categories = ['전체', '🔥 인기 추천', '문과', '이과', '예체능'];

  // Hide bottom navigation and header in detail/write view
  React.useEffect(() => {
    if (currentView === 'detail') {
      document.body.classList.add('community-detail-view');
      document.body.classList.remove('community-write-view');
    } else if (currentView === 'write') {
      document.body.classList.add('community-write-view');
      document.body.classList.remove('community-detail-view');
    } else {
      document.body.classList.remove('community-detail-view');
      document.body.classList.remove('community-write-view');
    }

    return () => {
      document.body.classList.remove('community-detail-view');
      document.body.classList.remove('community-write-view');
    };
  }, [currentView]);

  const getCommentsForPost = (postId) => {
    const commentsByPost = {
      1: [
        { id: 1, author: '코딩초보', content: '저도 똑같은 고민이에요! 혹시 어떤 프로그램 찾으셨나요?', date: '2025.09.16', isAuthor: false },
        { id: 2, author: '개발자선배', content: '네이버 커넥트재단에서 하는 부스트캠프 추천드려요! 무료고 정말 좋아요', date: '2025.09.16', isAuthor: false },
        { id: 3, author: '꿈나무22 (글쓴이)', content: '@개발자선배 오 정보 감사합니다! 찾아볼게요', date: '2025.09.16', isAuthor: true },
        { id: 4, author: 'IT전공생', content: '삼성 주니어 SW 아카데미도 좋더라고요. 고등학생도 신청 가능해요!', date: '2025.09.16', isAuthor: false }
      ],
      2: [
        { id: 1, author: '창업꿈나무', content: '저도 이 프로그램 관심있어요! 혹시 어떻게 신청하셨나요?', date: '2025.09.15', isAuthor: false },
        { id: 2, author: '스타트업드림 (글쓴이)', content: '@창업꿈나무 청소년활동진흥원 홈페이지에서 신청했어요!', date: '2025.09.15', isAuthor: true },
        { id: 3, author: '비즈니스맨', content: '실제로 창업하신 분들 이야기 들을 수 있어서 좋겠네요!', date: '2025.09.15', isAuthor: false }
      ],
      3: [
        { id: 1, author: '의대생선배', content: '둘 다 좋은 분야에요! 먼저 병원 봉사활동 해보시는 걸 추천드려요', date: '2025.09.14', isAuthor: false },
        { id: 2, author: '간호학과생', content: '간호대 재학생인데 질문 있으면 언제든 물어보세요!', date: '2025.09.14', isAuthor: false },
        { id: 3, author: '미래의사 (글쓴이)', content: '@의대생선배 @간호학과생 감사합니다! 혹시 DM 가능할까요?', date: '2025.09.14', isAuthor: true },
        { id: 4, author: '메디컬드림', content: '저도 같은 고민이에요ㅠㅠ 의료진 멘토링 프로그램 찾아보고 있어요', date: '2025.09.14', isAuthor: false }
      ],
      4: [
        { id: 1, author: '미디어꿈나무', content: '저도 관심있어요! 연락처 남겨주세요~', date: '2025.09.13', isAuthor: false },
        { id: 2, author: '예술학도', content: 'COEX 박람회 매년 가는데 정말 볼 게 많아요!', date: '2025.09.13', isAuthor: false },
        { id: 3, author: '아트러버 (글쓴이)', content: '@미디어꿈나무 DM 보내드릴게요!', date: '2025.09.13', isAuthor: true }
      ],
      5: [
        { id: 1, author: '같은상황', content: '저도 완전 같은 상황이에요... 부모님 설득이 어려워요ㅠ', date: '2025.09.12', isAuthor: false },
        { id: 2, author: '디자이너', content: '청소년상담복지센터에서 가족상담도 해줘요! 추천드려요', date: '2025.09.12', isAuthor: false },
        { id: 3, author: '진로상담사', content: '워크넷 진로상담에서 부모님과 함께 상담 받을 수 있어요', date: '2025.09.12', isAuthor: false },
        { id: 4, author: '디자인꿈나무 (글쓴이)', content: '모두 좋은 정보 감사합니다! 꼭 활용해볼게요', date: '2025.09.12', isAuthor: true }
      ],
      6: [
        { id: 1, author: '직업체험러', content: '저도 가보고 싶었는데 정보 감사해요!', date: '2025.09.11', isAuthor: false },
        { id: 2, author: '방송꿈나무', content: 'PD 체험 어떠셨나요? 자세히 알고 싶어요!', date: '2025.09.11', isAuthor: false },
        { id: 3, author: '체험러 (글쓴이)', content: '@방송꿈나무 실제 방송 제작 과정을 체험해볼 수 있어서 좋았어요!', date: '2025.09.11', isAuthor: true }
      ],
      7: [
        { id: 1, author: '심리학도', content: '심리학과 재학생입니다! 궁금한 점 있으면 물어보세요', date: '2025.09.10', isAuthor: false },
        { id: 2, author: '사복과선배', content: '사회복지학과도 정말 보람찬 전공이에요~ 실습 기회가 많아요', date: '2025.09.10', isAuthor: false },
        { id: 3, author: '도움이되고싶어 (글쓴이)', content: '선배님들 감사합니다! 더 자세한 이야기 듣고 싶어요', date: '2025.09.10', isAuthor: true }
      ],
      8: [
        { id: 1, author: '검사전문가', content: '커리어넷의 진로심리검사 추천드려요! 무료이고 정확해요', date: '2025.09.09', isAuthor: false },
        { id: 2, author: '상담받은사람', content: '한국고용정보원에서 하는 검사가 가장 신뢰도 높더라고요', date: '2025.09.09', isAuthor: false },
        { id: 3, author: '혼란중 (글쓴이)', content: '좋은 정보들 감사합니다! 하나씩 다 해볼게요', date: '2025.09.09', isAuthor: true }
      ],
      9: [
        { id: 1, author: '대학준비생', content: '우와 부럽네요! 어떻게 신청하셨나요?', date: '2025.09.08', isAuthor: false },
        { id: 2, author: '서울대생', content: '저희 학교 프로그램 참여해주셔서 감사해요! 도움이 되셨다니 기뻐요', date: '2025.09.08', isAuthor: false },
        { id: 3, author: '대학탐방러 (글쓴이)', content: '@대학준비생 각 대학교 홈페이지에서 신청 받아요! @서울대생 정말 감사했습니다', date: '2025.09.08', isAuthor: true }
      ],
      10: [
        { id: 1, author: '문과출신개발자', content: '저도 문과에서 개발자로 전향했어요! 충분히 가능해요', date: '2025.09.07', isAuthor: false },
        { id: 2, author: '수학쌤', content: '수학은 기초부터 차근차근 하면 돼요! 포기하지 마세요', date: '2025.09.07', isAuthor: false },
        { id: 3, author: '데이터꿈나무 (글쓴이)', content: '@문과출신개발자 정말요? 어떻게 공부하셨나요?', date: '2025.09.07', isAuthor: true },
        { id: 4, author: '코딩부트캠프', content: '문과생 대상 데이터 분석 입문 과정도 있어요!', date: '2025.09.07', isAuthor: false }
      ],
      11: [
        { id: 1, author: '교대생', content: '교대 재학생이에요! 봉사활동은 꼭 해보시길 추천드려요', date: '2025.09.06', isAuthor: false },
        { id: 2, author: '초등쌤', content: '현직 초등교사입니다. 아이들과의 소통이 가장 중요해요!', date: '2025.09.06', isAuthor: false },
        { id: 3, author: '미래선생님 (글쓴이)', content: '현직 선생님 의견까지! 정말 감사합니다', date: '2025.09.06', isAuthor: true }
      ],
      12: [
        { id: 1, author: '온라인참여자', content: '온라인도 오프라인만큼 좋더라고요! 집중만 잘하면 돼요', date: '2025.09.05', isAuthor: false },
        { id: 2, author: '줌피로', content: '저는 온라인이 더 편하던데요~ 시간도 절약되고', date: '2025.09.05', isAuthor: false },
        { id: 3, author: '온라인러닝 (글쓴이)', content: '다들 긍정적이네요! 신청해볼 용기가 생겼어요', date: '2025.09.05', isAuthor: true }
      ]
    };
    return commentsByPost[postId] || [];
  };

  const comments = selectedPost ? getCommentsForPost(selectedPost.id) : [];

  const handleLike = (postId, e) => {
    e.stopPropagation(); // 게시글 클릭 방지
    const newLikedPosts = new Set(likedPosts);
    const newPosts = posts.map(post => {
      if (post.id === postId) {
        if (likedPosts.has(postId)) {
          newLikedPosts.delete(postId);
          return { ...post, likes: post.likes - 1 };
        } else {
          newLikedPosts.add(postId);
          return { ...post, likes: post.likes + 1 };
        }
      }
      return post;
    });
    setLikedPosts(newLikedPosts);
    setPosts(newPosts);
    
    // 상세페이지가 열려있으면 selectedPost도 업데이트
    if (selectedPost && selectedPost.id === postId) {
      const updatedPost = newPosts.find(p => p.id === postId);
      setSelectedPost(updatedPost);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 4 - selectedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleHashtagKeyPress = (e) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput('');
      setIsEditingHashtag(false);
    } else if (e.key === 'Escape') {
      setHashtagInput('');
      setIsEditingHashtag(false);
    }
  };

  const handleHashtagBlur = () => {
    if (hashtagInput.trim()) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput('');
    }
    setIsEditingHashtag(false);
  };

  const removeHashtag = (indexToRemove) => {
    setHashtags(hashtags.filter((_, index) => index !== indexToRemove));
  };

  const handleWritePost = () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      const post = {
        id: posts.length + 1,
        category: selectedWriteCategory,
        title: newPost.title,
        content: newPost.content,
        author: '고3학생',
        date: new Date().toLocaleDateString('ko-KR').replace(/\./g, '.').slice(0, -1),
        likes: 0,
        comments: 0,
        views: 1,
        hashtag: hashtags.length > 0 ? hashtags.map(tag => `#${tag}`).join(' ') : '',
        imageUrl: selectedImages.length > 0 ? selectedImages[0] : null
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', hashtag: '' });
      setHashtags([]);
      setSelectedImages([]);
      setSelectedWriteCategory('진로·적성');
      setCurrentView('main');
    }
  };

  const PostItem = ({ post }) => (
    <div className="community__post-item" onClick={() => {
      setSelectedPost(post);
      setCurrentView('detail');
    }}>
      <div className="community__post-content">
        {/* Left Content */}
        <div className="community__post-main">
          <span className={`community__category-badge ${
            post.category === '진로·적성' ? 'community__category-badge--blue' :
            post.category === '자유소통' ? 'community__category-badge--green' :
            post.category === '고민상담' ? 'community__category-badge--purple' :
            'community__category-badge--orange'
          }`}>
            {post.category}
          </span>
          <h3 className="community__post-title">{post.title}</h3>
          <p className="community__post-meta">
            {post.author} · {post.date}
          </p>
          <div className="community__post-actions">
            <button 
              className={`community__action-button ${
                likedPosts.has(post.id) ? 'community__action-button--liked' : ''
              }`}
              onClick={(e) => handleLike(post.id, e)}
            >
              <svg 
                className={`community__action-icon ${likedPosts.has(post.id) ? 'community__action-icon--filled' : ''}`}
                viewBox="0 0 24 24"
                fill={likedPosts.has(post.id) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span className="community__action-text">{post.likes}</span>
            </button>
            <span className="community__action-info">
              <svg className="community__action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3h10c1.5 0 3 1.5 3 3v7c0 1.5-1.5 3-3 3h-4l-4 4v-4H7c-1.5 0-3-1.5-3-3V6c0-1.5 1.5-3 3-3Z"/>
              </svg>
              <span className="community__action-text">{post.comments}</span>
            </span>
            <span className="community__action-info">
              <svg className="community__action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              </svg>
              <span className="community__action-text">{post.views}</span>
            </span>
          </div>
        </div>
        
        {/* Right Image */}
        {post.imageUrl && (
          <div className="community__post-image">
            <img src={post.imageUrl} alt="게시글 이미지" className="community__post-image-content" />
          </div>
        )}
      </div>
    </div>
  );

  if (currentView === 'write') {
    return (
      <div className="community__container">
        {/* Header */}
        <div className="community__header">
          <button onClick={() => setCurrentView('main')} className="community__close-button">
            <svg className="community__close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <h1 className="community__header-title">글쓰기</h1>
          <button 
            className={`community__header-action ${newPost.title.trim() && newPost.content.trim() ? 'active' : ''}`}
            onClick={handleWritePost}
          >
            완료
          </button>
        </div>

        {/* Category Tabs */}
        <div className="community__category-section">
          <div className="community__category-tabs">
            {['진로·적성', '고민상담', '체험후기', '자유소통'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedWriteCategory(cat)}
                className={`community__category-tab ${
                  selectedWriteCategory === cat ? 'community__category-tab--active' : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Write Form */}
        <div className="community__write-form">
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            value={newPost.title}
            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            className="community__write-title"
          />
          
          <textarea
            placeholder="자유롭게 이야기해보세요."
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            className="community__write-content"
          />

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <div className="community__images-preview">
              {selectedImages.map((image, index) => (
                <div key={index} className="community__image-preview">
                  <img src={image} alt={`첨부 이미지 ${index + 1}`} className="community__preview-image" />
                  <button
                    className="community__image-remove"
                    onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="community__write-actions">
            <div className="community__write-tools">
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <button
                className="community__tool-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedImages.length >= 4}
              >
                <svg className="community__tool-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            
            <div className="community__write-hashtag">
              {!isEditingHashtag ? (
                <>
                  {hashtags.length > 0 ? (
                    <div className="community__hashtag-display">
                      {hashtags.map((tag, index) => (
                        <div key={index} className="community__hashtag-tag">
                          <span className="community__hashtag-text">#{tag}</span>
                          <button
                            className="community__hashtag-remove"
                            onClick={() => removeHashtag(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button className="community__hashtag-edit" onClick={() => setIsEditingHashtag(true)}>+</button>
                    </div>
                  ) : (
                    <button className="community__hashtag-placeholder" onClick={() => setIsEditingHashtag(true)}>
                      + 해시태그 추가
                    </button>
                  )}
                </>
              ) : (
                <div className="community__hashtag-input-container">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={handleHashtagKeyPress}
                    onBlur={handleHashtagBlur}
                    placeholder="해시태그를 입력하세요"
                    className="community__hashtag-input"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'detail' && selectedPost) {
    return (
      <div className="community__container">
        {/* Header */}
        <div className="community__header">
          <button onClick={() => setCurrentView('main')} className="community__back-button">
            <svg className="community__header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 12H5m7-7l-7 7 7 7"/>
            </svg>
          </button>
        </div>

        {/* Post Content */}
        <div className="community__detail-content">
          <div className="community__detail-post">
            <h1 className="community__detail-title">{selectedPost.title}</h1>
            <div className="community__detail-meta">
              <span>{selectedPost.author}</span>
              <span className="community__detail-separator">•</span>
              <span>{selectedPost.date}</span>
              <svg className="community__detail-views-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              </svg>
              <span>{selectedPost.views}</span>
            </div>
            <p className="community__detail-text">{selectedPost.content}</p>
            <span className="community__detail-hashtag">{selectedPost.hashtag}</span>
          </div>

          {/* Post Actions */}
          <div className="community__detail-actions">
            <button 
              className="community__detail-action"
              onClick={() => handleLike(selectedPost.id, { stopPropagation: () => {} })}
            >
              <svg 
                className={`community__detail-action-icon ${likedPosts.has(selectedPost.id) ? 'community__detail-action-icon--liked' : ''}`}
                fill={likedPosts.has(selectedPost.id) ? "currentColor" : "none"}
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.60L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span className={`community__detail-action-text ${likedPosts.has(selectedPost.id) ? 'community__detail-action-text--liked' : ''}`}>
                좋아요 {selectedPost.likes}
              </span>
            </button>
            <button className="community__detail-action">
              <svg className="community__detail-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 3h10c1.5 0 3 1.5 3 3v7c0 1.5-1.5 3-3 3h-4l-4 4v-4H7c-1.5 0-3-1.5-3-3V6c0-1.5 1.5-3 3-3Z"/>
              </svg>
              <span className="community__detail-action-text">댓글 {comments.length}</span>
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="community__comments">
          {comments.map((comment) => (
            <div key={comment.id} className="community__comment">
              <div className="community__comment-header">
                <span className={`community__comment-author ${comment.isAuthor ? 'community__comment-author--post-author' : ''}`}>
                  {comment.author}
                </span>
                <span className="community__comment-date">{comment.date}</span>
              </div>
              <p className="community__comment-content">{comment.content}</p>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="community__comment-input-container">
          <div className="community__comment-input">
            <input
              type="text"
              placeholder="댓글을 남겨보세요."
              className="community__comment-field"
            />
            <button className="community__comment-submit">
              <svg className="community__comment-submit-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="community__container">
      {/* Header */}
      <div className="community__main-header">
        <h1 className="community__main-title">고등학생 꿈터</h1>
        <svg className="community__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" strokeWidth="2"/>
        </svg>
      </div>

      {/* Category Tabs */}
      <div className="community__category-section">
        <div className="community__category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`community__category-tab ${
                selectedCategory === category ? 'community__category-tab--active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Post List */}
      <div className="community__post-list">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      {/* Write Button */}
      <div className="community__write-button-container">
        <button
          onClick={() => setCurrentView('write')}
          className="community__write-button"
        >
          <svg className="community__write-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="community__write-button-text">글쓰기</span>
        </button>
      </div>
    </div>
  );
};

export default Community;