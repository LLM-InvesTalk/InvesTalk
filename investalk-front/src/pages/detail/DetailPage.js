import StockInfoCard from "../../components/detail/stockinfo/StockInfoCard";
import FinancialStatements from "../../components/detail/financialstatements/FinancialStatements";
import Chatting from "../../components/detail/chatting/Chatting";
import SectorRecommend from "../../components/detail/recommend/SectorRecommend";
import Analyze from "../../components/detail/analyze/Analyze";

import { useOutletContext } from "react-router-dom";
import {useState } from "react";

const DetailPage = () => {
  const { tickerSymbol, period, setPeriod } = useOutletContext();
  console.log("period:",period)
  return (
    <div>
      <FinancialStatements tickerSymbol={tickerSymbol} />
      <StockInfoCard tickerSymbol={tickerSymbol} period={period} setPeriod={setPeriod} />
      <SectorRecommend />
      <Analyze tickerSymbol={tickerSymbol}/>
      <Chatting />
    </div>
  );
};

export default DetailPage;
