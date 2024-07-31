import '../index.scss'

import { Header } from "../components/header/Header.tsx";
import { Footer } from "../components/footer/Footer.tsx";
import { MainLogIn } from "../components/logIn/MainLogIn.tsx";
export const LogIn = () => {
    return (
        <div className='logIn'>
            <Header />
            <MainLogIn />
            <Footer />
        </div>
    );
};