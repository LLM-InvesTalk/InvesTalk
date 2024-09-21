import { useCallback, useState, useEffect, useRef } from "react";
import Input from "@mui/joy/Input";
import { IconButton } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./NavBar.module.css";

const NavBar = () => {
  const [keyword, setKeyword] = useState("");
  const wrapperRef = useRef(null); // 검색창과 결과를 감싸는 div 참조 생성

  const onChange = useCallback((e) => {
    setKeyword(e.target.value);
  }, []);

  // 바깥 클릭 시 검색 결과를 닫는 함수
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setKeyword(""); // 바깥 클릭 시 검색창 비우기
      }
    };

    // document에 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className={styles["frame-8"]} ref={wrapperRef}> {/* ref 추가 */}
      <img
        className={styles["frame-9"]}
        src="https://c.animaapp.com/8Gc7c0uK/img/frame-130.svg"
        alt="Frame"
      />
      <Input
        className={styles["vector-wrapper"]}
        placeholder="Search..."
        value={keyword}
        onChange={onChange}
        sx={{
          borderRadius: "40px",
        }}
        startDecorator={
          <IconButton
            variant="plain"
            size="sm"
            onClick={() => setKeyword("")}
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
      
      {keyword && (
        <div className={styles["rectangle-10"]}>
          <div className={styles["text-wrapper-25"]}>Search Result 1</div>
          <div className={styles["text-wrapper-26"]}>Search Result 2</div>
          <div className={styles["text-wrapper-27"]}>Search Result 3</div>
        </div>
      )}

      <div className={styles["navbar"]}>
        <div className={styles["text-wrapper-9"]}>Menu</div>
        <div className={styles["text-wrapper-10"]}>News</div>
        <div className={styles["text-wrapper-9"]}>Trend</div>
        <div className={styles["text-wrapper-9"]}>Mypage</div>
      </div>
    </div>
  );
};

export default NavBar;
