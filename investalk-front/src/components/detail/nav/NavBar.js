import { useCallback, useState } from "react";
import Input from "@mui/joy/Input";
import { IconButton } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";

const NavBar = () => {
  const [keyword, setKeyword] = useState("");

  const onChange = useCallback((e) => {
    setKeyword(e.target.value);
  }, []);

  return (
    <div className="frame-8">
      <img
        className="frame-9"
        src="https://c.animaapp.com/8Gc7c0uK/img/frame-130.svg"
        alt="Frame"
      />
      <Input
        className="vector-wrapper"
        placeholder="Search..."
        value={keyword}
        onChange={onChange}
        startDecorator={
          <IconButton
            variant="plain"
            size="sm"
            onClick={() => setKeyword("")}
            className="custom-icon-button"
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

      <div className="navbar">
        <div className="text-wrapper-9">Menu</div>
        <div className="text-wrapper-10">News</div>
        <div className="text-wrapper-9">Trend</div>
        <div className="text-wrapper-9">Mypage</div>
      </div>
    </div>
  );
};

export default NavBar;
