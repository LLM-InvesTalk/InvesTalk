import React from "react";
import styles from "./ButtonComponent.module.css"; // CSS Module import

const ButtonComponent = ({ onClick }) => {
  return (
    <div className={styles.group14} onClick={onClick} style={{ cursor: "pointer" }}>
      <div className={styles.overlap8}>
        <div className={styles.ellipse4}></div>
        <img
          className={styles.subtract}
          src="https://c.animaapp.com/8Gc7c0uK/img/subtract.svg"
          alt="Subtract"
        />
        <img
          className={styles.vector3}
          src="https://c.animaapp.com/8Gc7c0uK/img/vector-2.svg"
          alt="Vector"
        />
      </div>
    </div>
  );
};

export default ButtonComponent;
