
import './noAccess.scss'
import '../../static/extra-styles/button.scss'
import { useNavigate } from "react-router-dom";


export const NoAccess = () => {
    const history = useNavigate();
    const history1 = useNavigate();

    const logOut = () => {
        history('/')
    }
    const backward = () => {
        history1('/home')
    }
    return (
        <main className='noPage__container'>
            <h1 className='noPage__heading'>Kein Zugriff:</h1>
            <p className='noPage__desc'>Dir fehlen die nötigen Rechte, um auf PAM zuzugreifen.</p>
            <div className='noPage__buttons'>
                <button className='custom-button custom-button-1 green-button' onClick={logOut}>Ausloggen</button>
                <button className='custom-button custom-button-1 blue-button' onClick={backward}>Zurück zum Startbildschirm</button>
            </div>
        </main>
    );
};