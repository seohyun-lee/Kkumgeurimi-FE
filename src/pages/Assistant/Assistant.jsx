import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/constants.js';
import { chatService } from '../../services/chat.service.js';
import { programsService } from '../../services/programs.service.js';
import { useAuthStore } from '../../store/auth.store.js';
import { getMentorsForAssistant } from '../../data/mentors.js';
import RecommendationModal from '../../components/RecommendationModal.jsx';
import './Assistant.css';

/** ───────────────────────────────────────────────────────────
 *  메시지 상태 (최소 단위)
 *  type: 'user' | 'bot'
 *  content: string
 *  actions?: { title, description, feature }[]
 *  topMatches?: 프로그램 매칭 정보[]
 *  id: string
 *  createdAt: number
 *  ─────────────────────────────────────────────────────────── */

// 간단한 마크다운 렌더링
function renderMarkdown(text) {
  if (!text) return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
    .replace(/`(.*?)`/g, '<code>$1</code>') // `code`
    .replace(/\n/g, '<br />'); // 줄바꿈
}
const msgId = () => Math.random().toString(36).slice(2, 9);

function messagesReducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return action.payload ?? [];
    case 'ADD':
      return [...state, action.payload];
    default:
      return state;
  }
}

const DEMO_BOTS = getMentorsForAssistant();

export default function Assistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [currentBot, setCurrentBot] = useState(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [messages, dispatch] = useReducer(messagesReducer, []);
  const listRef = useRef(null);
  const typingRef = useRef(null);

  /** 오토스크롤(사용자가 하단 근처일 때만) */
  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTo({ top: el.scrollHeight, behavior: 'auto' });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  /** 초기화 - Career에서 전달된 봇 정보로 설정 */
  useEffect(() => {
    const botInfo = location.state;
    if (botInfo) {
      const bot = {
        name: botInfo.botName,
        job: botInfo.botJob,
        description: botInfo.botDescription,
        avatar: botInfo.botAvatar || '/mock_image_url/korean_woman_1.jpeg', // 전달된 아바타 사용
        initial: botInfo.botName.charAt(0),
      };
      setCurrentBot(bot);

      // 초기 메시지
      dispatch({
        type: 'RESET',
        payload: [
          {
            id: msgId(),
            type: 'bot',
            content: `안녕하세요! 저는 ${botInfo.botJob} ${bot.name}입니다. ${bot.description} 무엇을 도와드릴까요?`,
            createdAt: Date.now(),
          },
        ],
      });
    }
  }, [location.state]);

  /** 액션 라우팅 */
  const navigateToFeature = (feature) => {
    // 실제 라우팅 정책에 맞게 수정
    // 예: navigate(`/features/${feature}`);
    // 데모: 회원가입 예시로 라우팅
    if (feature === 'signup') navigate(ROUTES.SIGNUP);
    else if (feature === 'signin') navigate(ROUTES.SIGNIN);
    else navigate(ROUTES.HOME);
  };

  /** 메시지 전송 */
  const send = () => {
    const text = input.trim();
    if (!text || isSending) return;

    setIsSending(true);

    // 사용자 메시지 추가
    dispatch({
      type: 'ADD',
      payload: { id: msgId(), type: 'user', content: text, createdAt: Date.now() },
    });
    setInput('');
    // 타이핑 표시 → 응답 시뮬
    setIsTyping(true);
    simulateBotResponse(text);
  };

  /** Enter 전송 */
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };


  const simulateBotResponse = async (userText) => {
    try {
      // 실제 채팅 API 호출
      const response = await chatService.sendMessage({
        query: userText,
        profession: location.state?.profession || currentBot?.name || '학생',
        userId: user?.id || null,
        name: user?.name || '학생'
      });

      // 봇 응답 메시지 추가
      dispatch({
        type: 'ADD',
        payload: {
          id: msgId(),
          type: 'bot',
          content: response.answer,
          topMatches: response.topMatches,
          createdAt: Date.now(),
        },
      });

      setIsTyping(false);
      setIsSending(false);
    } catch (error) {
      console.error('Chat API error:', error);

      // API 실패 시 폴백 응답
      dispatch({
        type: 'ADD',
        payload: {
          id: msgId(),
          type: 'bot',
          content: '죄송합니다. 일시적으로 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.',
          createdAt: Date.now(),
        },
      });

      setIsTyping(false);
      setIsSending(false);
    }
  };

  // 모달 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  // 프로그램 추천받기
  const handleGetRecommendations = async () => {
    setIsLoadingRecommendations(true);

    try {
      const response = await programsService.getRecommendationsForChat({
        student_id: user?.id || null,
        profession: location.state?.profession || currentBot?.job || '기획자',
        top_k: 3
      });

      // 추천 결과를 봇 메시지로 추가
      dispatch({
        type: 'ADD',
        payload: {
          id: msgId(),
          type: 'bot',
          content: response.message,
          topMatches: response.top_matches.map(program => ({
            id: program.program_id,
            title: program.program_title,
            name: program.program_title,
            description: `${program.provider} | ${program.cost_type} | ${program.venue_region} | ${program.target_audience}`,
            score: program.score,
            provider: program.provider,
            cost_type: program.cost_type,
            start_date: program.start_date,
            end_date: program.end_date,
            program_type: program.program_type,
            venue_region: program.venue_region
          })),
          createdAt: Date.now(),
        },
      });
    } catch (error) {
      console.error('프로그램 추천 API error:', error);

      dispatch({
        type: 'ADD',
        payload: {
          id: msgId(),
          type: 'bot',
          content: '프로그램 추천을 가져오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          createdAt: Date.now(),
        },
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  return (
    <div className="assistant">
      {currentBot && (
        <section className="assistant__chat" aria-label="채팅 화면">
          <header className="chat__header">
            <button
              type="button"
              className="chat__back"
              onClick={() => navigate(-1)}
              aria-label="뒤로가기"
            >
              ←
            </button>
            <div className="chat__user">
              <div className="chat__avatar">
                <img src={currentBot.avatar} alt={currentBot.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div>
                <div className="chat__name">{currentBot.name}</div>
                <div className="chat__description">{currentBot.job}</div>
              </div>
            </div>
          </header>

          <main className="chat__messages" ref={listRef} role="log" aria-live="polite">
            {messages.map((m) => (
              <MessageRow
                key={m.id}
                type={m.type}
                avatar={m.type === 'bot' ? currentBot.avatar : null}
                content={m.content}
                actions={m.actions}
                topMatches={m.topMatches}
                onAction={navigateToFeature}
                onProgramClick={(program) => {
                  setSelectedProgram(program);
                  setIsModalOpen(true);
                }}
              />
            ))}

            {isTyping && (
              <div className="typing" ref={typingRef} aria-label="어시스턴트가 입력 중">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
            )}
          </main>

          <footer className="chat__footer">
            <div className="chat__recommendation-bar">
              <button
                type="button"
                className="chat__recommendation-button"
                onClick={handleGetRecommendations}
                disabled={isLoadingRecommendations}
              >
                {isLoadingRecommendations ? '추천 중...' : '프로그램 추천받기'}
              </button>
            </div>
            <div className="chat__inputbar">
              <textarea
                className="chat__input"
                placeholder="메시지를 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                aria-label="메시지 입력"
              />
              <button
                type="button"
                className="chat__send"
                onClick={send}
                aria-label="전송"
                disabled={!input.trim() || isSending}
              >
                <svg className="chat__send-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </button>
            </div>
          </footer>
        </section>
      )}

      {/* 프로그램 추천 정보 모달 */}
      <RecommendationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        program={selectedProgram}
      />
    </div>
  );
}

/** 메시지 한 줄 */
function MessageRow({ type, avatar, content, actions, topMatches, onAction, onProgramClick }) {
  
  return (
    <div className={`msg msg--${type}`}>
      {type === 'bot' && (
        <div className="msg__avatar">
          <img src={avatar} alt="Bot Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        </div>
      )}
      <div className={`msg__bubble msg__bubble--${type}`}>
        <div 
          className="msg__text"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
        
        {/* 프로그램 매칭 결과 표시 */}
        {Array.isArray(topMatches) && topMatches.length > 0 && (
          <div className="top-matches">
            <h4 className="top-matches__title">추천 프로그램</h4>
            <div className="top-matches__list">
              {topMatches.slice(0, 3).map((program, index) => (
                <div
                  key={program.id || index}
                  className="top-matches__item"
                  onClick={() => onProgramClick?.(program)}
                >
                  <div className="top-matches__name">{program.title || program.name}</div>
                  <div className="top-matches__desc">{program.description}</div>
                  {program.score && (
                    <div className="top-matches__score">매칭도: {Math.round(program.score * 100)}%</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 액션 버튼들 */}
        {Array.isArray(actions) && actions.length > 0 && (
          <div className="actions">
            {actions.map((a) => (
              <button
                key={`${a.feature}-${a.title}`}
                type="button"
                className="actions__item"
                onClick={() => onAction?.(a.feature)}
              >
                <div className="actions__title">
                  {a.title}
                  <span className="actions__arrow">→</span>
                </div>
                <div className="actions__desc">{a.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
