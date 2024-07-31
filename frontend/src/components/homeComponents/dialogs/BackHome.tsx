import './globalDialog.scss'
import '../../../static/extra-styles/button.scss'
import backHome from '../../../static/images/iconsModel/svg/file.svg'

type Props = {
    closeDialog: () => void,
    handleSubmit: () => void;

}

export const BackHome = ({closeDialog,handleSubmit}:Props) => {
    return (
        <div className="dialog dialog-green" onClick={e => e.stopPropagation()}>
            <div className="dialog__edit">
                <div className="dialog__icon-and-title">
                    <img className="dialog__icon" src={backHome} alt='icon'/>
                    <h3 className="dialog__title">Wollen Sie noch speichern?</h3>
                </div>
                <p className="dialog__description">
                    Wenn Sie auf "Nein" drücken wird das Model nicht gespeichert.
                </p>
                <div className="delete-dialog__button-groups dialog__button-groups">
                    <button className="custom-button green-button" onClick={closeDialog}>Nein</button>
                    <button className="custom-button green-button" onClick={handleSubmit}>Ja</button>
                </div>
            </div>
        </div>
    );
};