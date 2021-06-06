import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./header.css";
import { auth } from "./firebase";

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <nav>
      <div className="header__nav">
        <Link to="/" className="header__link">
          <div className="app__logo">
            <h1>KLite</h1>
          </div>
        </Link>
        <div className="signin__nav">
          {user ? (
            <>
              <button
                className="header__logoutbtn"
                onClick={() => auth.signOut()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header__link header__option">
                Login
              </Link>
              <Link to="/register" className="header__link header__option">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <hr />
    </nav>
  );
}

export default Header;
