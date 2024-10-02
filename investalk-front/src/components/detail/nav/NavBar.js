import { useCallback, useState, useEffect } from "react";
import Input from "@mui/joy/Input";
import { IconButton } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./NavBar.module.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = (props) => {
  const { setTickerSymbol } = props;

  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getSearchResult = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/search/${searchText}`
        );
        console.log("fetch search data: ", response.data);
        setSearchResult(response.data);
      } catch (error) {
        console.error("Error fetching scraps:", error);
      }
    };
    getSearchResult();
  }, [searchText]);

  const onChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

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
    <div className={styles["frame-8"]}>
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
              className={styles["text-wrapper-25"]}
              onClick={() => onSelectResult(result)}
            >
              {result.ticker} - {result["company name"]} ({result["short name"]}
              )
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
