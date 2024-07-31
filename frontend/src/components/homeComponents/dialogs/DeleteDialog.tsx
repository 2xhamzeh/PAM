
import './globalDialog.scss'
import '../../../static/extra-styles/button.scss'
import { DialogOwner } from "./dialogOwner.ts"
import deleteFolder from '../../../static/images/iconsFolder/delete.svg'
import deleteModel from '../../../static/images/iconsModel/svg/delete.svg'


const getDialogContent = (type: DialogOwner) => {
    switch (type) {
        case DialogOwner.DIRECTORY:
            return {
                icon: deleteFolder,
                title: "Ordner löschen?",
                description: "Soll dieser Ordner wirklich gelöscht werden? Sämtliche Inhalte des Ordners werden unwiderruflich gelöscht!",
                buttonColorClass: "blue-button",
                dialogClass: "dialog-blue",
            }
        case DialogOwner.MODEL:
            return {
                icon: deleteModel,
                title: "Modell löschen?",
                description: "Soll dieses Modell wirklich gelöscht werden? Das Modell wird unwiderruflich gelöscht!",
                buttonColorClass: "green-button",
                dialogClass: "dialog-green",
            }
    }
}

type Props = {
    dialogOwner: DialogOwner,
    handleSubmit: () => void,
    closeDialog: () => void
}

const DeleteDialog = (
    { dialogOwner, handleSubmit, closeDialog }: Props
) => {
    const dialogContent: { icon: string, title: string, description: string, buttonColorClass: string, dialogClass: string } = getDialogContent(dialogOwner);

    return (
        <div className={`dialog ${dialogContent.dialogClass}`} onClick={e => e.stopPropagation()}>
            <div className="delete-dialog__edit dialog__edit">
                <div className="delete-dialog__icon-and-title dialog__icon-and-title">
                    <img className="delete-dialog__icon dialog__icon" src={dialogContent.icon} alt='icon' />
                    <h3 className="delete-dialog__title dialog__title">{dialogContent.title}</h3>
                </div>

                <p className="delete-dialog__description dialog__description">{dialogContent.description}</p>
            </div>
            <div className="delete-dialog__button-groups dialog__button-groups">
                <button className={`custom-button ${dialogContent.buttonColorClass}`} onClick={closeDialog}>ABBRECHEN</button>
                <button className={`custom-button ${dialogContent.buttonColorClass}`} onClick={handleSubmit}>JA, ICH BIN MIR SICHER</button>
            </div>
        </div>
    )
}

export default DeleteDialog;