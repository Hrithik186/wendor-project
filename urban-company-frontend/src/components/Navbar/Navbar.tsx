import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          {user.role === 'carpenter' && <Link to="/carpenter-slots">Manage Slots</Link>}
          {user.role !== 'carpenter' && <Link to="/review-booking">Review Booking</Link>}
          {user.role !== 'carpenter' && <Link to="/book-slot">slot Booking</Link>}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;

