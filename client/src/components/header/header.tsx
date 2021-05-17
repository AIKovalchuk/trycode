import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../provider/auth/Auth";

import "./header.scss";

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  return (
    <header>
      {currentUser ? (
        <div>
          <span>currentUser.email</span>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <nav>
          <Link to="/login">Log In</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
