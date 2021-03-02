import React from "react";
import { useHistory } from "react-router";
import { Link, withRouter } from "react-router-dom";

const Header = () => {
  const history = useHistory();
  return (
    <>
      <div className="nav">
        <div className="logo" >Linkasafn</div>
        <Link className="link" to="/"> new </Link>
        <span>|</span>
        <Link className="link" to="/create">submit</Link>
      </div>
    </>
  );
};

export default Header;