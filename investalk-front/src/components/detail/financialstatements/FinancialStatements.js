import styles from "./FinancialStatements.module.css";

const FinancialStatements = () => {
  return (
    <div>
      <div className={styles["group-wrapper"]}>
        <div className={styles["group-2"]}>
          <div className={styles["text-wrapper-2"]}>재무제표</div>
          <div className={styles.frame}>
            {[...Array(3)].map((_, index) => (
              <div className={styles["frame-wrapper"]} key={index}>
                <div className={styles["frame-2"]}>
                  <div className={styles["frame-3"]}>
                    <div className={styles["frame-4"]}>
                      <div className={styles["text-wrapper-3"]}>수익성</div>
                      <div className={styles["text-wrapper-4"]}>·</div>
                      <div className={styles["text-wrapper-5"]}>분기별</div>
                    </div>
                    <div className={styles["frame-5"]}>
                      {["현금유동성", "순수익", "EPS", "마진"].map(
                        (item, idx) => (
                          <div className={styles["frame-6"]} key={idx}>
                            <div className={styles["text-wrapper-6"]}>
                              {item}
                            </div>
                            <div className={styles["frame-7"]}>
                              <div className={styles["text-wrapper-7"]}>+</div>
                              <div className={styles["text-wrapper-8"]}>
                                30%
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatements;
