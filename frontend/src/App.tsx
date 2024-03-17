import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Singup";
import Signin from "./pages/Signin";

function App(){
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />}  />
        <Route path="/signup" element={<Signup />}  />
      </Routes>
    </BrowserRouter>
  </div>
}

export default App;