import StockInfoCard from "../../components/detail/stockinfo/StockInfoCard";
import FinancialStatements from "../../components/detail/financialstatements/FinancialStatements";
import Chatting from "../../components/detail/chatting/Chatting";
import Recommend from "../../components/detail/recommend/Recommend";
import Analyze from "../../components/detail/analyze/Analyze";

import { useOutletContext } from "react-router-dom";

const DetailPage = () => {
  const { keyword } = useOutletContext();
  console.log("DetailPage: ", keyword);
  return (
    <div>
      <FinancialStatements tickerSymbol={keyword} />
      <StockInfoCard tickerSymbol={keyword} />
      <Recommend />
      <Analyze />
      <Chatting />
    </div>
  );
};

export default DetailPage;
