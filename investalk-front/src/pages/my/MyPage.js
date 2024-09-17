import Chatting from "../../components/detail/chatting/Chatting";
import TableComponent from "../../components/mypage/stockTable/TableComponent";
import MyAnalyze from "../../components/mypage/myAnalyze/myAnalyze";

const MyPage = () => {
    return (
        <div>
            <TableComponent />
            <Chatting />
            <MyAnalyze />
        </div>
    );
};

export default MyPage;