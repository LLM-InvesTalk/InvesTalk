import StockInfoCard from "../../components/detail/stockinfo/StockInfoCard";
import FinancialStatements from "../../components/detail/financialstatements/FinancialStatements";
import "../../components/detail/css/DetailGlobals.css";
import "../../components/detail/css/DetailStyleguide.css";

const TestPage = () => {
  return (
    <div>
      <div className="div-wrapper" style={{ display: "flex" }}>
        <StockInfoCard></StockInfoCard>
        <FinancialStatements />
      </div>
    </div>
  );
};

export default TestPage;
