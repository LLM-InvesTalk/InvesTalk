// LogInBox.js

import React from 'react';
import styles from './LogInBoxStyle.module.css';

// 이미지 import
import googleIcon from './img/google.svg';
import kakaotalkIcon from './img/kakaotalk.svg';
import naverIcon from './img/naver.svg';

const LogInBox = ({ onLoginSuccess }) => {
    const FLASK_URL = process.env.REACT_APP_FLASK_URL;

    const handleGoogleLogin = () => {
        window.location.href = `${FLASK_URL}/login/google`;
        onLoginSuccess(); // 로그인 성공 시 NavBar의 상태 업데이트
    };


    return (
        <div className={styles.box}>
            <div className={styles.group}>
                <img
                    className={styles.google}
                    src={googleIcon}
                    alt="Google"
                    onClick={handleGoogleLogin}
                />
                <img
                    className={styles.kakaotalk}
                    src={kakaotalkIcon}
                    alt="KakaoTalk"
                    onClick={() => alert("KakaoTalk 로그인은 아직 구현되지 않았습니다.")}
                />
                <img
                    className={styles.naver}
                    src={naverIcon}
                    alt="Naver"
                    onClick={() => alert("Naver 로그인은 아직 구현되지 않았습니다.")}
                />
            </div>
        </div>
    );
};

export default LogInBox;
