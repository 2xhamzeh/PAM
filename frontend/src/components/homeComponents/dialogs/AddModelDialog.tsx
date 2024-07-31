import './globalDialog.scss'
import '../../../static/extra-styles/button.scss'
import { ChangeEvent, useState } from "react"
import model from '../../../static/images/iconsModel/svg/file.svg'



type Props = {
    closeDialog: () => void,
    handleSubmit: (file: File | undefined) => void;
}

const AddModelDialog = ({ closeDialog, handleSubmit }: Props) => {
    const [newFile, setNewFile] = useState<File | undefined>(undefined);

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];
        setNewFile(file);
    }

    return (
        <div className="dialog dialog-green" onClick={e => e.stopPropagation()}>
            <div className="dialog__edit">
                <div className="dialog__icon-and-title">

                    <img className="dialog__icon" src={model} alt='icon' />
                    <h3 className="dialog__title">Modell erstellen</h3>
                </div>

                <p className="dialog__description">
                    Wie soll das neue Modell erstellt werden? Soll ein blankes Modell erstellt werden oder soll ein bestehendes Modell hochgeladen werden?
                </p>

                <input
                    type='file'
                    accept='.xml, .bpmn'
                    className="dialog__input dialog__input-green dialog__input-file"
                    onChange={handleChange}
                />
            </div>
            <div className="dialog__button-groups">
                <button className="custom-button green-button" onClick={closeDialog}>ABBRECHEN</button>
                <button className="custom-button green-button" onClick={() => handleSubmit(undefined)}>NEU ERSTELLEN</button>
                <button className={`custom-button green-button ${!newFile ? 'disabled' : ''}`} onClick={() => handleSubmit(newFile)} disabled={!newFile}>HOCHLADEN</button>
            </div>
        </div>
    )
}

export default AddModelDialog;