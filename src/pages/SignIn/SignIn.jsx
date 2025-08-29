import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store.js';
import { ROUTES } from '../../config/constants.js';
import Button from '../../components/Button.jsx'; // <-- 그대로 사용 (버튼 스타일 유지)
import './SignIn.css';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, isLoading, error } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
    else if (formData.password.length < 6) newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(formData);
      navigate(from, { replace: true }); // 로그인 후 원래 경로로
    } catch (err) {
      // store에서 error 처리됨
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="signin">
      <div className="signin__card">
        <div className="signin__header">
          <h1 className="signin__title">로그인</h1>  
        </div>

        {error && <div className="signin__error">{error}</div>}

        <form onSubmit={handleSubmit} className="signin__form" noValidate>
          <div className="signin__field">
            <label htmlFor="email" className="signin__label">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`signin__input ${errors.email ? 'error' : ''}`}
              placeholder="이메일을 입력하세요"
              disabled={isLoading}
              autoComplete="email"
              inputMode="email"
            />
            {errors.email && <span className="signin__field-error">{errors.email}</span>}
          </div>

          <div className="signin__field">
            <label htmlFor="password" className="signin__label">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`signin__input ${errors.password ? 'error' : ''}`}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.password && <span className="signin__field-error">{errors.password}</span>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            className="signin__submit-btn"
          >
            로그인
          </Button>
        </form>

        <div className="signin__footer">
          <p className="signin__footer-text">
            계정이 없으신가요?{' '}
            <Link to={ROUTES.SIGNUP} className="signin__footer-link">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
