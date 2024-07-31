import './header.scss'
import logo from "../../static/images/logo.svg"

export const Header = () => {
    return (
        <header className="header">
            <nav className="header-menu">
                <ul className="header-menu-list">
                    <li className="header-menu-item">
                        <a href="https://globalct.com/" target="_blank">
                            <img src={logo} alt="logo" />
                        </a>
                    </li>
                    <li className="header-menu-item__flex">
                        <a href="mailto:info@globalct.com">Contact us</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};