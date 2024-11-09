import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleGoogleLogin = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_URL}/login/google/callback`, {
                    credentials: "include",
                });
                if (response.ok) {
                    navigate("/mypage");  // 로그인 성공 시 MyPage로 이동
                } else {
                    navigate("/");  // 로그인 실패 시 메인 페이지로 이동
                }
            } catch (error) {
                navigate("/");  // 에러 발생 시 메인 페이지로 이동
            }
        };

        handleGoogleLogin();
    }, [navigate]);

    return (
        <div>
            <p>Processing Google login...</p>
        </div>
    );
};

export default GoogleCallback;
