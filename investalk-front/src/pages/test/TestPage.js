import StockInfoCard from "../../components/detail/stockinfo/StockInfoCard";
import FinancialStatements from "../../components/detail/financialstatements/FinancialStatements";
import AnalyzeChart from "../../components/detail/stockinfo/chart/analyzeChart";

const TestPage = () => {
  return (
    <div>
      <div className="div-wrapper" style={{ display: "flex" }}>
        <StockInfoCard></StockInfoCard>
        <FinancialStatements />
        <AnalyzeChart />
      </div>
    </div>
  );
};

export default TestPage;
