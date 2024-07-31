/*react*/
import {useState} from "react";
/*style*/
import './page.scss'
/*components*/
import AboutBody from "../components/about/AboutBody.tsx"
import UserInfo from "../components/homeComponents/body/UserInfo.tsx";
import Sidebar from "../components/homeComponents/sidebar/Sidebar.tsx";


const About = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = (isOpen: boolean | ((prevState: boolean) => boolean)) => {
        setIsSidebarOpen(isOpen);
    }

    return (
        <>
            <Sidebar onToggle={handleSidebarToggle}/>
            <div className={`about-main-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <header className='main-header'>
                    <p className='ueber'>Über</p>
                    <UserInfo/>
                </header>
                <AboutBody/>
            </div>
        </>

    )
}

export default About