import styles from "./style.module.css";

import { Outlet } from "react-router-dom";
import { useState } from "react";

import NavBar from "../../components/detail/nav/NavBar";

const LayoutPage = () => {
  const [tickerSymbol, setTickerSymbol] = useState("");
  return (
    <div>
      <div className={styles["div-wrapper"]}>
        <div className={styles["overlap"]}>
          <div className={styles["group"]}>
            <div className={styles["overlap-group"]}>
              <img
                className={styles["burst-star"]}
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-star.svg"
                alt="Burst Star"
              />
              <img
                className={styles["img"]}
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-star-3.svg"
                alt="Burst Star 3"
              />
            </div>
            <div className={styles["div"]}>
              <img
                className={styles["burst-star-2"]}
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-star-1.svg"
                alt="Burst Star 1"
              />
              <img
                className={styles["burst-star-3"]}
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-star-2.svg"
                alt="Burst Star 2"
              />
            </div>
            <div className={styles["overlap-2"]}>
              <img
                className={styles["burst-pucker"]}
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-pucker-2.svg"
                alt="Burst Pucker"
              />
              <img
                className={styles["burst-pucker-2"]}
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-pucker-2-1.svg"
                alt="Burst Pucker 2"
              />
            </div>
            <img
              className={styles["looper"]}
              src="https://c.animaapp.com/8Gc7c0uK/img/looper-3-1.png"
              alt="Looper"
            />
            <img
              className={styles["burst-pucker-3"]}
              src="https://c.animaapp.com/8Gc7c0uK/img/burst-pucker-2-2.svg"
              alt="Burst Pucker 3"
            />
          </div>
          <div className={styles["rectangle"]}></div>
          <NavBar setTickerSymbol={setTickerSymbol} />
          <Outlet context={{ tickerSymbol }} />
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;
