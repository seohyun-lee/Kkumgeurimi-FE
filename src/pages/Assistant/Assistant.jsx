import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/constants.js';
import { chatService } from '../../services/chat.service.js';
import { useAuthStore } from '../../store/auth.store.js';
import { getMentorsForAssistant } from '../../data/mentors.js';
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
  const { user } = useAuthStore();
  const [mode, setMode] = useState('selector'); // 'selector' | 'chat'
  const [currentBot, setCurrentBot] = useState(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedBotIndex, setSelectedBotIndex] = useState(null);

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

  /** 봇 선택 */
  const selectBot = (bot, index) => {
    setSelectedBotIndex(index);
    setCurrentBot({
      ...bot,
      initial: bot.name.charAt(0),
    });
    setMode('chat');
    // 초기화 메시지
    dispatch({
      type: 'RESET',
      payload: [
        {
          id: msgId(),
          type: 'bot',
          content: `안녕하세요! 저는 ${bot.name}입니다. ${bot.description}로 무엇을 도와드릴까요?`,
          createdAt: Date.now(),
        },
      ],
    });
  };

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
    if (!text) return;
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
        profession: currentBot?.name || '학생',
        userId: user?.id || null
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
    }
  };

  return (
    <div className="assistant">
      {mode === 'selector' && (
        <section className="assistant__selector" aria-label="봇 선택">
          <header className="selector__header">
            <h1 className="selector__title">AI 어시스턴트</h1>
            <p className="selector__subtitle">대화할 챗봇을 선택하세요</p>
          </header>

          <ul className="selector__list">
            {DEMO_BOTS.map((b, index) => (
              <li key={b.name}>
                <div className="selector__item">
                  <div className="selector__avatar">
                    <img src={b.avatar} alt={b.name} />
                  </div>
                  <div className="selector__info">
                    <h4 className="selector__name">{b.name}</h4>
                    <p className="selector__desc">{b.description}</p>
                  </div>
                  <button
                    type="button"
                    className="selector__chat-btn"
                    onClick={() => selectBot(b, index)}
                    aria-label={`${b.name}과 대화 시작`}
                  >
                    대화하기
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {mode === 'chat' && currentBot && (
        <section className="assistant__chat" aria-label="채팅 화면">
          <header className="chat__header">
            <button 
              type="button" 
              className="chat__back" 
              onClick={() => setMode('selector')} 
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
                <div className="chat__description">{currentBot.description}</div>
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
              />
            ))}

            {isTyping && (
              <div className="typing" ref={typingRef} aria-label="어시스턴트가 입력 중">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
            )}
          </main>

          <footer className="chat__inputbar">
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
              disabled={!input.trim()}
            >
              →
            </button>
          </footer>
        </section>
      )}
    </div>
  );
}

/** 메시지 한 줄 */
function MessageRow({ type, avatar, content, actions, topMatches, onAction }) {
  const navigate = useNavigate();
  
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
                  onClick={() => navigate(`/programs/${program.id}`)}
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
