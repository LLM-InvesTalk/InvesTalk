import { useCallback, useState, useRef, useEffect } from "react";
import Input from "@mui/joy/Input";
import { IconButton } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import LogInBox from "../../login/LogInBox.js";
import styles from "./NavBar.module.css";
import { useNavigate, useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = (props) => {
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loginBoxRef = useRef(null);
  const loginButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setTickerSymbol } = props;

  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  
  // wrapperRef를 useRef로 정의
  const wrapperRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getSearchResult = async () => {
      try {
        if (searchText.trim() === "") {
          setSearchResult([]); // 빈 검색어일 때 검색 결과 비우기
          return;
        }
        const response = await axios.get(
          `http://localhost:5000/api/search/${searchText}`
        );
        console.log("fetch search data: ", response.data);
        setSearchResult(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    getSearchResult();
  }, [searchText]);

  const onChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  // 백엔드에서 로그인 상태 확인
  const checkLoginStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_URL}/login/status`, {
        credentials: "include",
      });
      setIsLoggedIn(response.ok);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // 페이지가 처음 렌더링될 때 로그인 상태를 확인합니다.
  }, []);

  // MyPage 접근 시 토큰 검증 후 페이지 이동
  useEffect(() => {
    if (location.pathname === "/mypage") {
      const verifyToken = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_FLASK_URL}/login/status`, {
            credentials: "include",
          });
          if (!response.ok) {
            alert("로그인을 먼저 해주세요!");
            navigate("/");
          }
        } catch (error) {
          navigate("/");
        }
      };
      verifyToken();
    }
  }, [location, navigate]);

  // 로그아웃 처리 함수
  const handleLogOutClick = async () => {
    await fetch(`${process.env.REACT_APP_FLASK_URL}/login/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsLoggedIn(false);
    navigate('/');
  };

  // 로그인 박스를 닫는 함수
  const handleClickOutside = (event) => {
    if (
      loginBoxRef.current &&
      !loginBoxRef.current.contains(event.target) &&
      loginButtonRef.current &&
      !loginButtonRef.current.contains(event.target)
    ) {
      setShowLoginBox(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    setShowLoginBox(true);
  };

  // 로그인 성공 시 NavBar의 상태 업데이트
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginBox(false); // 로그인 박스 닫기
  };

  const onSearch = useCallback(() => {
    setTickerSymbol(searchText);
    setSearchText("");
    setSearchResult([]);
    navigate(`/detail`);
  }, [searchText, setTickerSymbol, navigate]);

  const onSelectResult = (result) => {
    setTickerSymbol(result.ticker);
    setSearchText("");
    setSearchResult([]);
    navigate(`/detail`);
  };

  return (
    <div className={styles["frame-8"]} ref={wrapperRef}>
      <img
        className={styles["frame-9"]}
        src="https://c.animaapp.com/8Gc7c0uK/img/frame-130.svg"
        alt="Frame"
      />
      <Input
        className={styles["vector-wrapper"]}
        placeholder="Search..."
        value={searchText}
        onChange={onChange}
        sx={{
          borderRadius: "40px",
        }}
        startDecorator={
          <IconButton
            variant="plain"
            size="sm"
            onClick={onSearch}
            className={styles["custom-icon-button"]}
            sx={{
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
                "--Icon-color": "currentColor",
                color: "var(--joy-palette-neutral-plainHoverColor, #0b0d0e)",
              },
              "&:active": {
                backgroundColor: "transparent",
                "--Icon-color": "currentColor",
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        }
      />

      {searchResult.length > 0 && (
        <div className={styles["rectangle-10"]}>
          {searchResult.map((result) => (
            <div
              key={result.ticker}
              className={styles["text-wrapper-25"]}
              onClick={() => onSelectResult(result)}
            >
              {result.ticker} - {result["company name"]} ({result["short name"]})
            </div>
          ))}
        </div>
      )}

      <div className={styles["navbar"]}>
        {!isLoggedIn ? (
          <div
            ref={loginButtonRef}
            className={styles["text-wrapper-9"]}
            onClick={handleLoginClick}
          >
            LogIn
          </div>
        ) : location.pathname === "/mypage" ? (
          <div className={styles["text-wrapper-9"]} onClick={handleLogOutClick}>
            LogOut
          </div>
        ) : (
          <div className={styles["text-wrapper-9"]} onClick={() => navigate("/mypage")}>
            MyPage
          </div>
        )}
        {showLoginBox && (
          <div ref={loginBoxRef} className={styles["login-box-wrapper"]}>
            <LogInBox onLoginSuccess={handleLoginSuccess} /> {/* 로그인 성공 시 호출 */}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
