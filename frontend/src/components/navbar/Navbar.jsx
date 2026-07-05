import { useState,  useContext } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext'
import {useNotificationStore} from "../../lib/notificationStore"

function Navbar() {
  const [open, setOpen] = useState(false);

  const {CurrentUser} = useContext(AuthContext);

  const fetch = useNotificationStore(state=>state.fetch)
  const number = useNotificationStore(state=>state.number)
  if(CurrentUser) fetch();

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/re-logo-design_731343-252.avif" alt="" />
          <span>PropertyPal</span>
        </Link>
        <Link to="/">Home</Link>
        <Link to="/list">Properties</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="right">
        {CurrentUser ? (
          <div className="user">
            <img
              src={CurrentUser.avatar || "noavatar.png"}
              alt=""
            />
            <span>{CurrentUser.username}</span>
            <Link to={`/profile/${CurrentUser.id}`} className="profile">
              {number>0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/">Agents</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
