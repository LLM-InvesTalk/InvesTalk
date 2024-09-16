import React from "react";
import styles from "./Analyze.module.css"; // CSS 모듈 import

const Analyze = () => {
  return (
    <div className={styles.divWrapper}>
      <div className={styles.overlapWrapper}>
        <div className={styles.overlap3}>
          <div className={styles.textWrapper}>Assistock 분석서</div>
          <div className={styles.textDescription}>
            Text Description...<br />
            .................................................................<br />
            .................................................................<br />
            ...............................................................<br />
            .........................................<br />
            .............................................................
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
