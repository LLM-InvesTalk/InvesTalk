import { useState } from "react";
import "./StockInfoCard.css";

import StockInfoChart from "./chart";

import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";

const StockInfoCard = () => {
  const [variant, setVariant] = useState("outlined");
  const [isLike, setIsLike] = useState(false);

  return (
    <div>
      <div className="group-15">
        <div className="group-16">
          <div className="overlap-9">
            <div className="group-17">
              <div className="frame-25">
                <div className="text-wrapper-28">Semiconductor</div>
                <div className="text-wrapper-29">Symbol: NVDA</div>
              </div>
              <div className="frame-26">
                <div className="frame-27">
                  <img
                    className="group-18"
                    src="https://c.animaapp.com/8Gc7c0uK/img/group-2@2x.png"
                    alt="icon"
                  />
                  <div className="text-wrapper-30">0.00</div>
                </div>
                <div className="frame-28">
                  <img
                    className="group-18"
                    src="https://c.animaapp.com/8Gc7c0uK/img/group-2@2x.png"
                    alt="icon"
                  />
                  <div className="frame-27">
                    <div className="text-wrapper-31">analyst rating</div>
                    <div className="text-wrapper-31">0.00</div>
                  </div>
                </div>
              </div>
              <div className="group-19">
                <div className="frame-29">
                  <ButtonGroup
                    className="frame-30"
                    variant={variant}
                    size="xs"
                    color="primary"
                    aria-label="radius button group"
                    sx={{ "--ButtonGroup-radius": "40px" }}
                  >
                    <Button className="text-wrapper-32">1일</Button>
                    <Button className="text-wrapper-32">1달</Button>
                    <Button className="text-wrapper-32">1년</Button>
                  </ButtonGroup>
                </div>
                <div className="group-20">
                  <StockInfoChart></StockInfoChart>
                  <div>
                    <div className="text-wrapper-33">+30%</div>
                    <div className="text-wrapper-34">-30%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="group-22">
              <div className="overlap-group-4">
                {isLike === false ? (
                  <img
                    className="vector-4"
                    src="https://c.animaapp.com/8Gc7c0uK/img/vector-3.svg"
                    alt="icon"
                    onClick={() => {
                      setIsLike(true);
                    }}
                  />
                ) : (
                  <img
                    className="vector-5"
                    src="https://c.animaapp.com/8Gc7c0uK/img/vector-4.svg"
                    alt="icon"
                    onClick={() => {
                      setIsLike(false);
                    }}
                  />
                )}
                <div className="text-wrapper-35">Nvidia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInfoCard;
