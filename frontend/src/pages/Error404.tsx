import "../index.scss"
import "./page.scss"
import "../static/extra-styles/button.scss"
import {Header} from "../components/header/Header.tsx";
import {Footer} from "../components/footer/Footer.tsx";
import {useNavigate} from "react-router-dom";

export const Error404 = () => {
    const history = useNavigate();
    const backward = () => {
        history('/home')
    }
    return (
        <div className="errorPage">
            <Header />
            <main className="content">
                <svg viewBox="0 0 960 200">
                    <symbol id="e-text">
                        <text textAnchor="middle" x="50%" y="80%">404</text>
                    </symbol>
                    <g className="g-ants">
                        <use xlinkHref="#e-text" className="text"></use>
                        <use xlinkHref="#e-text" className="text"></use>
                        <use xlinkHref="#e-text" className="text"></use>
                        <use xlinkHref="#e-text" className="text"></use>
                        <use xlinkHref="#e-text" className="text"></use>
                    </g>
                </svg>

                <h1>Page Not Found</h1>
                <button className='custom-button custom-button-1 blue-button' onClick={backward}>Back Home
                </button>
            </main>
            <Footer/>
        </div>
    );
};