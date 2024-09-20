import Chatting from '../../components/detail/chatting/Chatting';
import NewsComponent from '../../components/mainpage/news/NewsComponent';
import DynamicBarChart from '../../components/mainpage/dailygraph/GraphComponent.js';

const MainPage = () => {
  return (
    <div >
      <DynamicBarChart />
      <NewsComponent />
      <Chatting />
    </div>
  );
};

export default MainPage;
