import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoWhite from "../../assets/images/logo_noir.png";
import LogoBlue from "../../assets/images/logo_blanc.png";
import {
  MdOutlineClose,
  MdOutlineEvent,
  MdOutlineGridView,
  MdOutlinePeople,
  MdOutlinePlaylistAdd,
  MdOutlineSettings,
  MdOutlineStorage,
  MdOutlineBook
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("");

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setActiveMenuItem(location.pathname);
  }, [location]);

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} className="logoo" alt="" />
          {/* <span className="sidebar-brand-text">SKEMA CANADA</span> */}
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <MenuItemLink to="/" icon={<MdOutlineGridView size={18} />} text="Dashboard" active={activeMenuItem === "/"} />
            <MenuItemLink to="/Stocks" icon={<MdOutlineStorage size={20} />} text="Stocks" active={activeMenuItem === "/Stocks"} />
            <MenuItemLink to="/Calendar" icon={<MdOutlineEvent size={18} />} text="Calendar" active={activeMenuItem === "/Calendar"} />
            <MenuItemLink to="/Process" icon={<MdOutlinePlaylistAdd size={20} />} text="Process" active={activeMenuItem === "/Process"} />
            <MenuItemLink to="/Settings" icon={<MdOutlineSettings size={20} />} text="Settings" active={activeMenuItem === "/Settings"} />
            <MenuItemLink to="/activate" icon={<MdOutlineBook size={20} />} text="Activate course" active={activeMenuItem === "/activate"} />
            <MenuItemLink to="/Profile" icon={<MdOutlinePeople size={20} />} text="Profile" active={activeMenuItem === "/Profile"} />
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Component for menu items
const MenuItemLink = ({ to, icon, text, active }) => {
  return (
    <li className="menu-item">
      <Link to={to} className={`menu-link ${active ? "active" : ""}`}>
        <span className="menu-link-icon">
          {icon}
        </span>
        <span className="menu-link-text">{text}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
