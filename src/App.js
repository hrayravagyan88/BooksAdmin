import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "../src/components/SignIn";
import Dashboard from "../src/components/Dashboard";
import SuperAdmin from "../src/components/SuperAdmin";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
      </Routes>
    </Router>
  );
};

export default App;
