import './globalDialog.scss'
import '../../../static/extra-styles/button.scss'
import { ChangeEvent, useState } from "react"

import {Description} from "../../../static/images/iconsModel/react-components/Description.tsx";

type Props = {
    currentDescription: string,
    closeDialog: () => void,
    handleSubmit: (newDescription: string) => () => void
}

const DescriptionDialog = ({ currentDescription, closeDialog, handleSubmit }: Props) => {
    const [newDesc, setNewDesc] = useState<string>(currentDescription);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewDesc(e.target.value);
    }

    return (
        <div className="dialog dialog-green" onClick={e => e.stopPropagation()}>
            <div className="dialog__edit">
                <div className="dialog__icon-and-title">
                    <Description className='dialog__icon dropdown__button-icon-green' />
                    <h3 className="dialog__title">Beschreibung ändern?</h3>
                </div>

                <p className="dialog__description">
                    Bitte geben Sie die neue Beschreibung in das nachfolgende Textfeld ein.
                </p>

                <input className="dialog__input dialog__input-green" value={newDesc} onChange={handleChange}
                       style={{
                           borderColor: newDesc.length === 0  ? "#BF1932" : "#7BC297"
                       }}/>
            </div>
            <div className="dialog__button-groups">
                <button className="custom-button green-button" onClick={closeDialog}>ABBRECHEN</button>

                <button className="custom-button green-button"
                     onClick={newDesc !== currentDescription ? handleSubmit(newDesc) : () => null}
                        style={{
                            cursor: newDesc.length === 0  ? "not-allowed" : "pointer",
                            opacity:0.5
                        }}
                >
                    ÄNDERN
                </button>
            </div>
        </div>
    )
}

export default DescriptionDialog;