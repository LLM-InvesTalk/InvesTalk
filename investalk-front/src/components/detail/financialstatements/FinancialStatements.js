import "./FinancialStatements.css";

const FinancialStatements = () => {
  return (
    <div>
      <div className="group-wrapper">
        <div className="group-2">
          <div className="text-wrapper-2">재무제표</div>
          <div className="frame">
            {[...Array(3)].map((_, index) => (
              <div className="frame-wrapper" key={index}>
                <div className="frame-2">
                  <div className="frame-3">
                    <div className="frame-4">
                      <div className="text-wrapper-3">수익성</div>
                      <div className="text-wrapper-4">·</div>
                      <div className="text-wrapper-5">분기별</div>
                    </div>
                    <div className="frame-5">
                      {["현금유동성", "순수익", "EPS", "마진"].map(
                        (item, idx) => (
                          <div className="frame-6" key={idx}>
                            <div className="text-wrapper-6">{item}</div>
                            <div className="frame-7">
                              <div className="text-wrapper-7">+</div>
                              <div className="text-wrapper-8">30%</div>
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
