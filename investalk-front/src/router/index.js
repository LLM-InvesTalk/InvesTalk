import { createBrowserRouter } from "react-router-dom";

//pages
import Test from "../pages/test/TestPage";
import Detail from "../pages/detail/DetailPage";
import Layout from "../pages/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Detail />, // 기본 페이지 Detail -> Main
      },
      {
        path: "detail",
        element: <Detail />,
      },
    ],
  },
  {
    path: "/test",
    element: <Test />,
  },
]);

export default router;