import {Header} from "../components/header/Header.tsx";
import {Footer} from "../components/footer/Footer.tsx";
import {NoAccess} from "../components/noAccess/NoAccess.tsx";

export const KeinZugriff = () => {
    return (
        <div className='logIn'>
            <Header />
            <NoAccess />
            <Footer/>
        </div>
    );
};