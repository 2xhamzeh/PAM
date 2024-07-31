import './globalDialog.scss'
import '../../../static/extra-styles/button.scss'
import { ChangeEvent, useState } from "react"
import saveIcon from "../../../static/images/iconsModel/svg/save.svg"

type Props = {
    closeDialog: () => void,
    handleSubmit: (name: string) => () => void
}

const SaveDialog = ({  closeDialog, handleSubmit }: Props) => {
    const [newName, setNewName] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    }

    return (
        <div className="dialog dialog-green" onClick={e => e.stopPropagation()}>
            <div className="dialog__edit">
                <div className="dialog__icon-and-title">
                    <img className="dialog__icon" src={saveIcon} alt='icon' />
                    <h3 className="dialog__title">Name erstellen?</h3>
                </div>

                <p className="dialog__description">
                    Bitte geben Sie die Name in das nachfolgende Textfeld ein.
                </p>

                <input className="dialog__input dialog__input-green" value={newName} onChange={handleChange}
                       style={{
                           borderColor: newName.length === 0  ? "#BF1932" : "#7BC297"
                       }}/>
            </div>
            <div className="dialog__button-groups">
                <button className="custom-button green-button" onClick={closeDialog}>Abbrechen</button>
                <button className="custom-button green-button" onClick={handleSubmit(newName)}
                        style={{
                            cursor: newName.length === 0  ? "not-allowed" : "pointer"
                        }}>Erstellen</button>
            </div>
        </div>
    )
}

export default SaveDialog;