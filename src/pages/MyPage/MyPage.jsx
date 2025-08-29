import React, { useEffect, useState } from "react";
import { meService } from "../../services/me.service";
import ProgramCard from "../../components/ProgramCard";
import "./MyPage.css";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [joinedPrograms, setJoinedPrograms] = useState([]);
  const [likedPrograms, setLikedPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profile, joined, liked] = await Promise.all([
          meService.getProfile(),
          meService.getRegistrations(),
          meService.getLikedPrograms(),
        ]);
        setUser(profile);
        setJoinedPrograms(joined || []);
        setLikedPrograms(liked || []);
      } catch (err) {
        console.error("마이페이지 API 에러:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="mypage">불러오는 중...</div>;
  if (!user) return <div className="mypage">유저 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="mypage">
      <header className="mypage__header">
        <h1 className="mypage__title">내 정보</h1>
        <div className="mypage__profile">
          <div className="mypage__avatar">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">🙂</div>
            )}
          </div>
          <div className="mypage__info">
            <div className="mypage__name">{user.name}</div>
            <div className="mypage__email">{user.email}</div>
          </div>
        </div>
      </header>

      <section className="mypage__section">
        <h2>참여 프로그램</h2>
        <div className="mypage__grid">
          {joinedPrograms.length > 0 ? (
            joinedPrograms.map((p) => (
              <ProgramCard key={p.programId} program={p} isLiked={false} />
            ))
          ) : (
            <p className="mypage__empty">아직 참여한 프로그램이 없습니다.</p>
          )}
        </div>
      </section>

      <section className="mypage__section">
        <h2>찜한 프로그램</h2>
        <div className="mypage__grid">
          {likedPrograms.length > 0 ? (
            likedPrograms.map((p) => (
              <ProgramCard key={p.programId} program={p} isLiked={true} />
            ))
          ) : (
            <p className="mypage__empty">찜한 프로그램이 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
