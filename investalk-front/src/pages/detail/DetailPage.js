import StockInfoCard from "../../components/detail/stockinfo/StockInfoCard";
import FinancialStatements from "../../components/detail/financialstatements/FinancialStatements";

const DetailPage = () => {
  return (
    <div>
      <FinancialStatements />
      <StockInfoCard />
    </div>
  );
};

export default DetailPage;
