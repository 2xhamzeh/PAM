import './globalDialog.scss'
import '../../../static/extra-styles/button.scss'
import { ChangeEvent, useState } from "react"
import { DialogOwner } from "./dialogOwner.ts"
import renameFolder from '../../../static/images/iconsFolder/rename.svg'
import renameModel from '../../../static/images/iconsModel/svg/rename.svg'



const getDialogInfo = (type: DialogOwner) => {
    switch (type) {
        case DialogOwner.DIRECTORY:
            return {
                icon: renameFolder,
                title: "Ordner umbenennen?",
                description: "Bitte geben Sie den neuen Namen des Ordners in das nachfolgende Textfeld ein.",
                buttonColorClass: "blue-button",
                dialogClass: "dialog-blue",
                dialogInputClass: "dialog__input-blue",
            }
        case DialogOwner.MODEL:
            return {
                icon: renameModel,
                title: "Modell umbenennen?",
                description: "Bitte geben Sie den neuen Namen des Modells in das nachfolgende Textfeld ein.",
                buttonColorClass: "green-button",
                dialogClass: "dialog-green",
                dialogInputClass: "dialog__input-green",
            }
    }
}

type Props = {
    dialogOwner: DialogOwner,
    currentName: string,
    handleSubmit: (newName: string) => () => void,
    closeDialog: () => void
}

const RenameDialog = (
    { dialogOwner, currentName, handleSubmit, closeDialog }: Props
) => {

    const [newName, setNewName] = useState<string>(currentName);

    const dialogContent: {
        icon: string, title: string, description: string,
        buttonColorClass: string, dialogClass: string, dialogInputClass: string
    } = getDialogInfo(dialogOwner);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    }

    return (
        <div className={`dialog ${dialogContent.dialogClass}`} onClick={e => e.stopPropagation()}>
            <div className="dialog__edit">
                <div className="dialog__icon-and-title">
                    <img className="dialog__icon" src={dialogContent.icon} alt='icon' />
                    <h3 className="dialog__title">{dialogContent.title}</h3>
                </div>

                <p className="dialog__description">{dialogContent.description}</p>

                <input className={`dialog__input ${dialogContent.dialogInputClass}`} value={newName} onChange={handleChange}
                       style={{
                           borderColor: newName.length === 0
                               ? "#BF1932"
                               : dialogContent.dialogInputClass === 'dialog__input-blue'
                                   ? "#21335B"
                                   : "#7BC297"
                       }}
                />
            </div>
            <div className="dialog__button-groups">
                <button className={`custom-button ${dialogContent.buttonColorClass}`} onClick={closeDialog}>ABBRECHEN</button>
                <button className={`custom-button ${dialogContent.buttonColorClass}`}
                    onClick={newName.length !== 0 && newName !== currentName ? handleSubmit(newName) : () => null}
                        style={{
                            cursor: newName.length === 0  ? "not-allowed" : "pointer"
                        }}
                >
                    UMBENNEN
                </button>
            </div>
        </div>
    )
}

export default RenameDialog;