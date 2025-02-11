import { createBrowserRouter } from "react-router-dom";

// pages
import Detail from "../pages/detail/DetailPage";
import Main from "../pages/main/MainPage";
import Layout from "../pages/layout";
import MyPage from "../pages/my/MyPage";
import GoogleCallback from '../pages/login/GoogleCallback';  // GoogleCallback 컴포넌트 임포트

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { 
        index: true, 
        element: <Main /> 
      },
      { 
        path: "detail", 
        element: <Detail /> 
      },
      { 
        path: "mypage", 
        element: <MyPage /> 
      },
      { 
        path: "login/google/callback", 
        element: <GoogleCallback /> 
      },  // Google Callback 라우트 추가
    ],
  },
]);

export default router;
