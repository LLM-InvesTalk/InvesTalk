import { useState } from "react";
import styles from "./StockInfoCard.module.css";

import StockInfoChart from "./chart";

import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";

const StockInfoCard = () => {
  const [variant, setVariant] = useState("outlined");
  const [isLike, setIsLike] = useState(false);

  return (
    <div>
      <div className={styles["group-15"]}>
        <div className={styles["group-16"]}>
          <div className={styles["overlap-9"]}>
            <div className={styles["group-17"]}>
              <div className={styles["frame-25"]}>
                <div className={styles["text-wrapper-28"]}>Semiconductor</div>
                <div className={styles["text-wrapper-29"]}>Symbol: NVDA</div>
              </div>
              <div className={styles["frame-26"]}>
                <div className={styles["frame-27"]}>
                  <img
                    className={styles["group-18"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/group-2@2x.png"
                    alt="icon"
                  />
                  <div className={styles["text-wrapper-30"]}>0.00</div>
                </div>
                <div className={styles["frame-28"]}>
                  <img
                    className={styles["group-18"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/group-2@2x.png"
                    alt="icon"
                  />
                  <div className={styles["frame-27"]}>
                    <div className={styles["text-wrapper-31"]}>
                      analyst rating
                    </div>
                    <div className={styles["text-wrapper-31"]}>0.00</div>
                  </div>
                </div>
              </div>
              <div className={styles["group-19"]}>
                <div className={styles["frame-29"]}>
                  <ButtonGroup
                    className={styles["frame-30"]}
                    variant={variant}
                    size="xs"
                    color="primary"
                    aria-label="radius button group"
                    sx={{ "--ButtonGroup-radius": "40px" }}
                  >
                    <Button className={styles["text-wrapper-32"]}>1일</Button>
                    <Button className={styles["text-wrapper-32"]}>1달</Button>
                    <Button className={styles["text-wrapper-32"]}>1년</Button>
                  </ButtonGroup>
                </div>
                <div className={styles["group-20"]}>
                  <StockInfoChart></StockInfoChart>
                  <div>
                    <div className={styles["text-wrapper-33"]}>+30%</div>
                    <div className={styles["text-wrapper-34"]}>-30%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["group-22"]}>
              <div className={styles["overlap-group-4"]}>
                {isLike === false ? (
                  <img
                    className={styles["vector-4"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/vector-3.svg"
                    alt="icon"
                    onClick={() => {
                      setIsLike(true);
                    }}
                  />
                ) : (
                  <img
                    className={styles["vector-5"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/vector-4.svg"
                    alt="icon"
                    onClick={() => {
                      setIsLike(false);
                    }}
                  />
                )}
                <div className={styles["text-wrapper-35"]}>Nvidia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInfoCard;
