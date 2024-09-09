import "./style.css";

import { Outlet } from "react-router-dom";

import NavBar from "../../components/detail/nav/NavBar";

const LayoutPage = () => {
  return (
    <div>
      <div className="div-wrapper">
        <div className="overlap">
          <div className="group">
            <div className="overlap-group">
              <img
                className="burst-star"
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-star.svg"
                alt="Burst Star"
              />
              <img
                className="img"
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-star-3.svg"
                alt="Burst Star 3"
              />
            </div>
            <div className="div">
              <img
                className="burst-star-2"
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-star-1.svg"
                alt="Burst Star 1"
              />
              <img
                className="burst-star-3"
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-star-2.svg"
                alt="Burst Star 2"
              />
            </div>
            <div className="overlap-2">
              <img
                className="burst-pucker"
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-pucker-2.svg"
                alt="Burst Pucker"
              />
              <img
                className="burst-pucker-2"
                src="https://c.animaapp.com/8Gc7c0uK/img/burst-pucker-2-1.svg"
                alt="Burst Pucker 2"
              />
            </div>
            <img
              className="looper"
              src="https://c.animaapp.com/8Gc7c0uK/img/looper-3-1.png"
              alt="Looper"
            />
            <img
              className="burst-pucker-3"
              src="https://c.animaapp.com/8Gc7c0uK/img/burst-pucker-2-2.svg"
              alt="Burst Pucker 3"
            />
          </div>
          <div class="rectangle"></div>
          <NavBar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;
