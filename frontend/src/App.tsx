import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Singup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import Redirect from "./components/Redirect";

function App(){
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />}  />
        <Route path="/signup" element={<Signup />}  />
        <Route path="/dashboard" element={<Dashboard />}  />
        <Route path="/send" element={<SendMoney/>}/>
        <Route path="/" element={<Redirect to="/signin" />} />
      </Routes>
    </BrowserRouter>
  </div>
}

export default App;