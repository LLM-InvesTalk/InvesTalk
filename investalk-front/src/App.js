import { RouterProvider } from "react-router-dom";
import router from "./router";

// css
import "./components/detail/css/DetailGlobals.css";
import "./components/detail/css/DetailStyleguide.css";

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
