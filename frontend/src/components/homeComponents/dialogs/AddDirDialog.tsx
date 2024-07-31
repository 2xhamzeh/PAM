import './globalDialog.scss'
import '../../../static/extra-styles/button.scss'
import { ChangeEvent, useState } from "react"
import folder from '../../../static/images/iconsFolder/folder.svg'


type Props = {
    closeDialog: () => void,
    handleSubmit: (name: string) => void;

}

const AddDirDialog = ({ closeDialog, handleSubmit }: Props) => {
    const [name, setName] = useState<string>("");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    return (
        <div className="dialog dialog-blue" onClick={e => e.stopPropagation()}>
            <div className="dialog__edit">
                <div className="dialog__icon-and-title">
                    <img className="dialog__icon" src={folder} alt='icon' />
                    <h3 className="dialog__title">Ordner erstellen?</h3>
                </div>

                <p className="dialog__description">
                    Bitte geben Sie den Namen des Ordners im nachfolgenden Textfeld ein.
                </p>

                <input className="dialog__input dialog__input-blue" value={name} onChange={handleChange}
                       style={{
                           borderColor: name.length === 0  ? "#BF1932" : "#21335B"
                       }}/>
            </div>
            <div className="dialog__button-groups">
                <button className="custom-button blue-button" onClick={closeDialog}>ABBRECHEN</button>

                <button className="custom-button blue-button"
                    onClick={name.length !== 0 ? () => handleSubmit(name) : () => null}
                        style={{
                            cursor: name.length === 0  ? "not-allowed" : "pointer"
                        }}
                >
                    ERSTELLEN
                </button>
            </div>
        </div>
    )
}

export default AddDirDialog;