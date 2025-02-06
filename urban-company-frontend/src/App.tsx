import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import SlotBooking from './pages/Slotbooking/SlotBooking';
import CarpenterSlots from './pages/CarpenterSlots/CarpenterSlots';
import ReviewBooking from './pages/ReviewBooking/ReviewBooking';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />  
           <Route path="/book-slot" element={<SlotBooking />} />
          <Route path="/carpenter-slots" element={<CarpenterSlots />} />
          <Route path="/review-booking" element={<ReviewBooking />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
