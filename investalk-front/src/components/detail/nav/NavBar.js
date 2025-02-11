import { useCallback, useState, useRef, useEffect } from "react";
import Input from "@mui/joy/Input";
import { IconButton } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import LogInBox from "../../login/LogInBox.js";
import styles from "./NavBar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const NavBar = (props) => {
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loginBoxRef = useRef(null);
  const loginButtonRef = useRef(null);
  const location = useLocation();
  const { setTickerSymbol, setPeriod } = props;

  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  // wrapperRef를 useRef로 정의
  const wrapperRef = useRef(null);

  // **검색 Input 및 검색 결과용 ref 정의**
  const searchInputRef = useRef(null);   // 검색창 ref ~하는 함수
  const searchResultRef = useRef(null);  // 검색 결과 리스트 ref ~하는 함수

  const navigate = useNavigate();

  useEffect(() => {
    const getSearchResult = async () => {
      try {
        if (searchText.trim() === "") {
          setSearchResult([]); // 빈 검색어일 때 결과 비우기 ~설정
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

    setPeriod("1d");
  }, [searchText, setPeriod]);

  const onChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  // 백엔드에서 로그인 상태 확인
  const checkLoginStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URL}/login/status`,
        {
          credentials: "include",
        }
      );
      setIsLoggedIn(response.ok);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // 페이지 렌더링 시 로그인 상태 확인 ~설정
  }, []);

  // MyPage 접근 시 토큰 검증 후 페이지 이동
  useEffect(() => {
    if (location.pathname === "/mypage") {
      const verifyToken = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_FLASK_URL}/login/status`,
            {
              credentials: "include",
            }
          );
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
    navigate("/");
  };

  // 로그인 박스 외부 클릭 시 로그인 박스 숨김 함수
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

  // 로그인 성공 시 NavBar의 상태 업데이트 함수
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginBox(false); // 로그인 박스 닫기 ~하는 함수
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

  // **검색창 외부 클릭 시 검색 결과 리스트 숨김 이벤트 등록**
  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      // 검색 Input 및 결과 영역 외부를 클릭한 경우
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target)
      ) {
        setSearchResult([]); // 검색 결과 숨김 ~설정
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, []);

  return (
    <div className={styles["frame-8"]} ref={wrapperRef}>
      <img
        className={styles["frame-9"]}
        src="https://c.animaapp.com/8Gc7c0uK/img/frame-130.svg"
        alt="Frame"
        onClick={() => navigate("/")} // 클릭 시 기본 경로("/")로 이동 ~하는 함수
        style={{ cursor: "pointer" }} // 클릭 가능하도록 커서 변경 ~설정
      />
      <Input
        className={styles["vector-wrapper"]}
        placeholder="Search..."
        value={searchText}
        onChange={onChange}
        ref={searchInputRef} // 검색 Input에 ref 추가 ~하는 함수
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
        <div className={styles["rectangle-10"]} ref={searchResultRef}>
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
          <div
            className={styles["text-wrapper-9"]}
            onClick={() => navigate("/mypage")}
          >
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
