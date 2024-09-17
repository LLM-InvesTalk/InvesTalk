import { createBrowserRouter } from "react-router-dom";

//pages
import Detail from "../pages/detail/DetailPage";
import Main from "../pages/main/MainPage";
import Layout from "../pages/layout";
import MyPage from "../pages/my/MyPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Main />, // 기본 페이지 Detail -> Main
      },
      {
        path: "detail",
        element: <Detail />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      }
    ],
  },
]);

export default router;
