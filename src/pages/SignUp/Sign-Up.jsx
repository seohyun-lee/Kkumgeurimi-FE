import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store.js';
import { ROUTES } from '../../config/constants.js';
import Button from '../../components/Button.jsx';
import './Sign-Up.css';


const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  // 스토어에서 signup 또는 register 지원 (둘 중 있는거 사용)
  const { signup, register, isLoading, error } = useAuthStore();
  const performSignUp = signup || register;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // 필드별 에러 초기화
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));

    // 비밀번호 확인 실시간 체크 (선택)
    if ((name === 'password' || name === 'confirmPassword') && formData.confirmPassword) {
      if ((name === 'password' ? value : formData.password) !== (name === 'confirmPassword' ? value : formData.confirmPassword)) {
        setErrors((prev) => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (!performSignUp) {
        console.warn('useAuthStore에 signup/register 함수가 없습니다.');
        return;
      }
      await performSignUp({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
      });
      // TODO: 토큰 처리

      // 성공 시 ONBOARDING_INTERESTS으로 이동
      navigate(ROUTES.ONBOARDING_INTERESTS, { replace: true });
    } catch (err) {
      // 전역 store에서 error 세팅한다고 가정
      console.error('Sign up failed:', err);
    }
  };

  return (
    <div className="signup">
      <div className="signup__card">
        <div className="signup__header">
          <h1 className="signup__title">회원가입</h1>
          <p className="signup__subtitle">꿈그라미에 오신 걸 환영합니다</p>
        </div>

        {error && <div className="signup__error">{error}</div>}

        <form onSubmit={handleSubmit} className="signup__form" noValidate>
          <div className="signup__field">
            <label htmlFor="name" className="signup__label">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              className={`signup__input ${errors.name ? 'error' : ''}`}
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="name"
            />
            {errors.name && <span className="signup__field-error">{errors.name}</span>}
          </div>

          <div className="signup__field">
            <label htmlFor="email" className="signup__label">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`signup__input ${errors.email ? 'error' : ''}`}
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="email"
              inputMode="email"
            />
            {errors.email && <span className="signup__field-error">{errors.email}</span>}
          </div>

          <div className="signup__field">
            <label htmlFor="password" className="signup__label">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`signup__input ${errors.password ? 'error' : ''}`}
              placeholder="비밀번호 (6자 이상)"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.password && <span className="signup__field-error">{errors.password}</span>}
          </div>

          <div className="signup__field">
            <label htmlFor="confirmPassword" className="signup__label">비밀번호 확인</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`signup__input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="signup__field-error">{errors.confirmPassword}</span>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            className="signup__submit-btn"
          >
            회원가입
          </Button>
        </form>

        <div className="signup__footer">
          <p className="signup__footer-text">
            이미 계정이 있으신가요?{' '}
            <Link to={ROUTES.SIGNIN} className="signup__footer-link">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
