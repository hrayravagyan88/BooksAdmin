import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "../src/components/SignIn";
import Dashboard from "../src/components/Dashboard";
import SuperAdmin from "../src/components/SuperAdmin";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once we have the user's state
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
     {user ? <Route path="/dashboard" element={<Dashboard />} />: <Route path="/" element={<SignIn />} />}   
        <Route path="/superadmin" element={<SuperAdmin />} />
      </Routes>
    </Router>
  );
};

export default App;
