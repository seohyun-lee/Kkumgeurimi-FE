import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/constants.js';
import './Assistant.css';

/** ───────────────────────────────────────────────────────────
 *  메시지 상태 (최소 단위)
 *  type: 'user' | 'bot'
 *  content: string
 *  actions?: { title, description, feature }[]
 *  id: string
 *  createdAt: number
 *  ─────────────────────────────────────────────────────────── */
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

const DEMO_BOTS = [
  { 
    name: '강하나', 
    description: '업무 도우미',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    emoji: '💼'
  },
  { 
    name: '김지수', 
    description: '학습 도우미',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    emoji: '📚'
  },
  { 
    name: '이민호', 
    description: '창작 도우미',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    emoji: '🎨'
  },
  { 
    name: '박소영', 
    description: '생활 도우미',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    emoji: '🏠'
  },
];

export default function Assistant() {
  const navigate = useNavigate();
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

  /** 데모용 응답(실서비스에선 서버 스트리밍/웹소켓 교체) */
  const demoResponses = useMemo(
    () => [
      {
        text: '건강 관리에 도움이 될 기능들을 추천드릴게요! 🏃‍♀️',
        actions: [
          { title: '운동 플래너', description: '개인별 맞춤 운동 계획을 세워보세요', feature: 'workout_planner' },
          { title: '식단 기록하기', description: 'AI 영양사가 식단을 분석해드립니다', feature: 'diet_tracker' },
        ],
      },
      {
        text: '학습에 도움이 될 도구들을 안내해드릴게요. 📖',
        actions: [
          { title: '학습 스케줄러', description: '효율적인 학습 일정을 만들어보세요', feature: 'study_scheduler' },
          { title: '진도 체크', description: '학습 진행상황을 확인하세요', feature: 'progress_tracker' },
          { title: '퀴즈 생성기', description: '학습한 내용으로 퀴즈를 만들어보세요', feature: 'quiz_generator' },
        ],
      },
      {
        text: '업무 효율을 높이는 방법을 제안해드릴게요. 💼',
        actions: [{ title: '업무 관리 도구', description: '할일과 일정을 효율적으로 관리하세요', feature: 'task_manager' }],
      },
      { text: '좋은 질문이네요! 더 자세히 분석해보겠습니다. 🤔' },
    ],
    []
  );

  const simulateBotResponse = (userText) => {
    const pick = demoResponses[Math.floor(Math.random() * demoResponses.length)];
    // 네트워크/추론 대기 모사
    const delay = 700 + Math.random() * 900;
    setTimeout(() => {
      dispatch({
        type: 'ADD',
        payload: {
          id: msgId(),
          type: 'bot',
          content: pick.text,
          actions: pick.actions,
          createdAt: Date.now(),
        },
      });
      setIsTyping(false);
    }, delay);
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
                <button
                  type="button"
                  className="selector__item"
                  onClick={() => selectBot(b, index)}
                  aria-label={`${b.name}(${b.description})와 대화 시작`}
                  style={{
                    '--bot-gradient': b.gradient,
                    '--bot-emoji': `"${b.emoji}"`
                  }}
                >
                  <div className="selector__avatar" style={{ background: b.gradient }}>
                    {b.emoji}
                  </div>
                  <div className="selector__info">
                    <h3 className="selector__name">{b.name}</h3>
                    <p className="selector__desc">{b.description}</p>
                  </div>
                </button>
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
              <div 
                className="chat__avatar" 
                style={{ background: currentBot.gradient || 'var(--primary-gradient)' }}
              >
                {currentBot.emoji || currentBot.initial}
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
                avatar={m.type === 'bot' ? (currentBot.emoji || currentBot.initial) : null}
                content={m.content}
                actions={m.actions}
                onAction={navigateToFeature}
                botGradient={currentBot.gradient}
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
function MessageRow({ type, avatar, content, actions, onAction, botGradient }) {
  return (
    <div className={`msg msg--${type}`}>
      {type === 'bot' && (
        <div 
          className="msg__avatar" 
          style={{ background: botGradient || 'var(--primary-gradient)' }}
        >
          {avatar}
        </div>
      )}
      <div className={`msg__bubble msg__bubble--${type}`}>
        <div className="msg__text">{content}</div>
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
