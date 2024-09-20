import StockInfoCard from "../../components/detail/stockinfo/StockInfoCard";
import FinancialStatements from "../../components/detail/financialstatements/FinancialStatements";
import Chatting from "../../components/detail/chatting/Chatting";
import SectorRecommend from "../../components/detail/recommend/SectorRecommend";
import Analyze from "../../components/detail/analyze/Analyze";

const DetailPage = () => {
  return (
    <div>
      <FinancialStatements />
      <StockInfoCard />
      <SectorRecommend />
      <Analyze />
      <Chatting />
    </div>
  );
};

export default DetailPage;
