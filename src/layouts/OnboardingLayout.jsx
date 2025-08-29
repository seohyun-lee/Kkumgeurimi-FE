import { Outlet, Link } from "react-router-dom";
import { ROUTES } from "../config/constants";
import "./OnboardingLayout.css";

export default function OnboardingLayout() {
  const year = new Date().getFullYear();
  return (
    <div className="onbd hero">
      {/* 필요하면 로고만, 로그인 버튼 없음 */}
      <header className="onbd__header">
          <Link className="brand-wordmark">꿈그리미</Link>
      </header>

      <main className="onbd__main">
        <Outlet />
      </main>

      <footer className="onbd__footer">© {year} 꿈그리미</footer>
    </div>
  );
}
