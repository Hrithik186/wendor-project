import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Urban Company Booking</h1>
      <p>Book a slot with a carpenter easily.</p>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </div>
  );
};

export default Home;
