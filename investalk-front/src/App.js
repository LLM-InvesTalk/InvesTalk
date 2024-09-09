import { BrowserRouter, Route, Routes } from "react-router-dom";

// pages
import Test from "./pages/test/TestPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Main />} /> */}
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
