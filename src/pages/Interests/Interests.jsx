// src/pages/Interests/Interests.jsx
import { useMemo, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import "./Interests.css";
import { useAuthStore } from "../../store/auth.store.js";
import { ROUTES, INTEREST_GROUPS, getLabelByCode } from "../../config/constants.js";


export default function Interests() {
  const [selected, setSelected] = useState(() => new Set()); // 코드 Set<number>
  const [open, setOpen] = useState(() => new Set(INTEREST_GROUPS.map(g => g.key))); // 기본 전부 펼침
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthStore?.() || {};

  const groups = useMemo(() => INTEREST_GROUPS, []);

  const toggleCode = (code) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const toggleGroup = (codes) => {
    setSelected(prev => {
      const next = new Set(prev);
      const allSelected = codes.every(c => next.has(c));
      if (allSelected) codes.forEach(c => next.delete(c));
      else codes.forEach(c => next.add(c));
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size === 0) return;
    setSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${API_BASE}/me/interests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ interests: Array.from(selected) }),
      });
      if (!res.ok) throw new Error(await res.text());
      navigate(ROUTES.HOME, { replace: true });
    } catch (e) {
      console.error(e);
      alert("관심사 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="interests-page">
      <div className="interests-bg" aria-hidden />
      <section className="interests interests--flat">
        <header className="interests__header">
          <h1 className="interests__title">관심사 선택</h1>
          <p className="interests__subtitle">큰 그룹을 먼저 고르고, 필요하면 하위 항목을 조정하세요.</p>
        </header>

        <div className="ig">
          {groups.map((g) => {
            const selCount = g.codes.filter(c => selected.has(c)).length;
            const all = selCount === g.codes.length;
            const some = selCount > 0 && !all;

            // indeterminate 체크박스 표현을 위해 ref 사용
            const cbRef = useRef(null);
            useEffect(() => {
              if (cbRef.current) cbRef.current.indeterminate = some;
            }, [some]);

            const expanded = open.has(g.key);

            return (
              <div className="ig__group" key={g.key}>
                <button
                  type="button"
                  className="ig__header"
                  onClick={() => {
                    setOpen(prev => {
                      const next = new Set(prev);
                      expanded ? next.delete(g.key) : next.add(g.key);
                      return next;
                    });
                  }}
                >
                  <span className="ig__left">
                    <input
                      ref={cbRef}
                      type="checkbox"
                      checked={all}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleGroup(g.codes);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${g.label} 선택 토글`}
                    />
                    <span className="ig__label">{g.label}</span>
                  </span>
                  <span className="ig__right">
                    <span className="ig__count">{selCount}/{g.codes.length}</span>
                    <svg className={`ig__chev ${expanded ? "open" : ""}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </span>
                </button>

                {expanded && (
                  <div className="ig__grid" role="group" aria-label={`${g.label} 하위`}>
                    {g.codes.map((code) => {
                      const active = selected.has(code);
                      return (
                        <button
                          key={code}
                          type="button"
                          className={`interest-chip ${active ? "active" : ""}`}
                          onClick={() => toggleCode(code)}
                          aria-pressed={active}
                          title={getLabelByCode(code)}
                        >
                          <span className="chip__label">{getLabelByCode(code)}</span>
                          <span className="chip__check" aria-hidden>
                            <svg width="18" height="18" viewBox="0 0 24 24">
                              <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="interests__actions">
          <Button
            type="button"
            variant="primary"
            size="large"
            fullWidth
            disabled={submitting || selected.size === 0}
            loading={submitting}
            onClick={handleSubmit}
          >
            {selected.size > 0 ? `${selected.size}개 선택 완료` : "최소 1개 선택"}
          </Button>

          <button
            className="interests__skip"
            type="button"
            onClick={() => navigate(ROUTES.HOME, { replace: true })}
          >
            건너뛰기
          </button>
        </div>
      </section>
    </div>
  );
}
