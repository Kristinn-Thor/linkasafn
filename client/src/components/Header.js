import React from "react";
import { useRef } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuthToken, useLogout } from './AuthToken';

const Header = () => {
  const history = useHistory();
  const [authToken, ,] = useAuthToken();
  const logout = useLogout();
  const input = useRef(null);

  const onLinkClick = () => {
    input.current.checked = false;
  };

  return (
    <header className="header">
      <div className="logo" ><a href="/">Linkasafn</a></div>
      <input ref={input} type="checkbox" id="nav-toggle" className="nav-toggle" />
      <nav className="nav">
        <ul className="nav-links">
          <Link onClick={onLinkClick} className="link" to="/"> Nýtt </Link>
          <span>|</span>
          <Link onClick={onLinkClick} className="link" to="/top">Topp 20</Link>
          <span>|</span>
          <Link onClick={onLinkClick} className="link" to="/search">Leita</Link>
          {authToken && (
            <><span>|</span> <Link onClick={onLinkClick} className="link" to="/create">Setja inn Link</Link></>
          )}

          <div className="logInOut" >
            {authToken ? (
              <div
                className="link"
                onClick={() => {
                  logout();
                  history.push('/');
                  onLinkClick();
                }}
              >
                Skrá út
              </div>
            ) : (
              <Link onClick={onLinkClick} to="/login" className="link">
                Innskráning
              </Link>
            )}
          </div>
        </ul>

      </nav>
      <label htmlFor="nav-toggle" className="nav-toggle-label">
        <span>🍔</span>
      </label>
    </header>
  );
};

export default Header;