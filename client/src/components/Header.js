import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuthToken, useLogout } from './AuthToken';

const Header = () => {
  const history = useHistory();
  const [authToken, ,] = useAuthToken();
  const logout = useLogout();
  const [hamburgerState, setHamburgerState] = useState(false);

  return (
    <>
      <div className="nav">
        <div className="logo" ><a href="/">Linkasafn</a></div>
        <div className={(hamburgerState) ? "nav-flexGroup slideIn" : "nav-flexGroup"}>
          <div className="nav-links">
            <Link className="link" to="/"> Nýtt </Link>
            <span>|</span>
            <Link className="link" to="/top">Topp 20</Link>
            <span>|</span>
            <Link className="link" to="/search">Leita</Link>
            {authToken && (<><span>|</span> <Link className="link" to="/create">Setja inn Link</Link></>)}
          </div>
          <div className="logInOut" >
            {authToken ? (
              <div
                className="link"
                onClick={() => {
                  logout();
                  history.push('/');
                }}
              >
                Skrá út
              </div>
            ) : (
              <Link to="/login" className="link">
                Innskráning
              </Link>
            )}
          </div>

        </div>
        <button
          className="hamburger"
          onClick={() => {
            (hamburgerState) ? setHamburgerState(false) : setHamburgerState(true);
          }}
        >🍔</button>
      </div>
    </>
  );
};

export default Header;