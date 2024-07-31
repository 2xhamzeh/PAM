/*react*/
import { Link, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";

/*styles*/
import '../../../index.scss'
import './sidebar.scss'
import '../../../pages/page.scss'

/*icons*/
import home from '../../../static/images/sidebarIcons/home.svg'
import ueber from '../../../static/images/sidebarIcons//ueber.svg'
import logOut from '../../../static/images/sidebarIcons/logOut.svg'
import myDiagramm from '../../../static/images/sidebarIcons/myDiagramm.svg'
import fav from '../../../static/images/sidebarIcons/fav.svg'

/*redux*/
import dirModelThunk from "../../../store/dirModel/dirModelThunk";
import { useAppDispatch } from "../../../store";


// @ts-ignore
const Sidebar = ({ onToggle }) => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    /*
        inode = 0 => home
        inode = -1 => my favorite
        inode = -2 => my diagrams
    */
    const loadDirectory = (inode: number) => async () => {
        await dispatch(dirModelThunk.loadDirectoryByInode(inode))
        navigate("/home")
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        onToggle(!isOpen);
    }


    return (
        <div className={`menu ${isOpen ? 'open' : 'closed'}`}>
            <nav className="menu__navbar">
                <div className="menu__navbar__list-top">
                    <div className="menu__navbar__list-title">
                       <div className="menu-btn" onClick={toggleSidebar}>
                            <div className={`menu-btn_container ${isOpen ? 'active' : ''}`}>
                                <div className="arrow"></div>
                                <div className="arrow"></div>
                                <div className="arrow"></div>
                            </div>
                        </div>
                        <Link to="/"><h2 className={`menu__navbar-list-item_logo ${isOpen ? 'open' : 'closed'}`}>PAM</h2></Link>
                    </div>


                    <ul className="menu__navbar-list_nav">
                        <li className="menu__navbar-list-item" onClick={loadDirectory(-2)}>
                            <Link className='menu__navbar-list-item_link' to="">
                                <img src={myDiagramm} alt="icon"/>
                                <span className={`item-link_text ${isOpen ? 'active' : 'passive'}`}>Meine Diagramme</span>
                            </Link>
                        </li>
                        <li className="menu__navbar-list-item" onClick={loadDirectory(-1)}>
                            <Link className='menu__navbar-list-item_link' to="">
                                <img src={fav} alt="icon"/>
                                <span className={`item-link_text ${isOpen ? 'active' : 'passive'}`}>Meine Favoriten</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="menu__navbar-list-bottom">
                    <ul className="menu__navbar-list_nav">
                        <li className="menu__navbar-list-item"
                            onClick={loadDirectory(0)}>
                            <Link className='menu__navbar-list-item_link' to="">
                                <img src={home} alt="icon" />
                                <span className={`item-link_text ${isOpen ? 'active' : 'passive'}`}>Hauptmenü</span>
                            </Link>
                        </li>
                        <li className="menu__navbar-list-item">
                            <Link className='menu__navbar-list-item_link' to="/about">
                                <img src={ueber} alt="icon" />
                                <span className={`item-link_text ${isOpen ? 'active' : 'passive'}`}>Über</span>
                            </Link>
                        </li>
                        <li className="menu__navbar-list-item">
                            <a className='menu__navbar-list-item_link' href="http://localhost:8080/quit-session">
                                <img src={logOut} alt="icon" />
                                <span className={`item-link_text ${isOpen ? 'active' : 'passive'}`}>Auslogen</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default Sidebar