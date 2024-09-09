import StockInfoCard from "../../components/detail/stockinfo/StockInfoCard";
import FinancialStatements from "../../components/detail/financialstatements/FinancialStatements";

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
