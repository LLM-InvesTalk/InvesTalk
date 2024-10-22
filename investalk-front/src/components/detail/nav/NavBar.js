import { useCallback, useState, useEffect, useRef } from "react";
import Input from "@mui/joy/Input";
import { IconButton } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./NavBar.module.css";

const NavBar = () => {
  const [keyword, setKeyword] = useState("");
  const wrapperRef = useRef(null);

  // 예시 검색 결과 배열
  const searchResults = [
    "Search Result 1",
    "Search Result 2",
    "Search Result 3",
  ];

  const onChange = useCallback((e) => {
    setKeyword(e.target.value);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setKeyword("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

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

      {/* 검색 결과가 있을 때만 렌더링 */}
      {keyword && (
        <div className={styles["rectangle-10"]}>
          {searchResults.map((result, index) => (
            <div key={index} className={styles["text-wrapper"]}>
              {result}
            </div>
          ))}
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
