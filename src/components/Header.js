import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { AUTH_TOKEN } from "./constants";

const Header = () => {
  const history = useHistory();
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <>
      <div className="nav">
        <div className="nav-flexGroup" >
          <div className="logo" >Linkasafn</div>
          <Link className="link" to="/"> new </Link>
          <span>|</span>
          <Link className="link" to="/top">top</Link>
          <span>|</span>
          <Link className="link" to="/search">search</Link>
          {authToken && (<><span>|</span> <Link className="link" to="/create">submit</Link></>)}
        </div>
        <div className="login" >
          {authToken ? (
            <div
              className="link"
              onClick={() => {
                localStorage.removeItem(AUTH_TOKEN);
                history.push('/');
              }}
            >
              logout
            </div>
          ) : (
              <Link to="/login" className="link">
                login
              </Link>
            )}
        </div>
      </div>
    </>
  );
};

export default Header;