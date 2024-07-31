import './logIn.scss';
import logo from "../../static/images/microsoftLogo.svg"

export const MainLogIn = () => {

    return (
        <main className='login-container'>
            <h1 className="login-container__main-heading">PAM</h1>
            <button className="login-button" type="button"
                    onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/azure'}>
                <img className="login-button__logo" src={logo} alt="logo-microsoft"/>
                <span className="login-button__link">Sign in with Microsoft</span>
            </button>
        </main>
    );
};