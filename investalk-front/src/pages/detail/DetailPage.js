import StockInfoCard from "../../components/detail/stockinfo/StockInfoCard";
import FinancialStatements from "../../components/detail/financialstatements/FinancialStatements";
import Chatting from "../../components/detail/chatting/Chatting";
import SectorRecommend from "../../components/detail/recommend/SectorRecommend";
import Analyze from "../../components/detail/analyze/Analyze";

import { useOutletContext } from "react-router-dom";

const DetailPage = () => {
  const { tickerSymbol } = useOutletContext();
  return (
    <div>
      <FinancialStatements tickerSymbol={tickerSymbol} />
      <StockInfoCard tickerSymbol={tickerSymbol} />
      <SectorRecommend />
      <Analyze />
      <Chatting />
    </div>
  );
};

export default DetailPage;
