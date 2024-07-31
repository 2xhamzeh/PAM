/*react*/
import React, { useCallback, useMemo, useState } from "react"
import { createPortal } from "react-dom"

/*styles*/
import './globalCard.scss'

/*icons*/
import { HeartIcon } from '../../../static/images/iconsModel/react-components/HeartIcon.tsx';
import modelIcon from '../../../static/images/iconsModel/svg/file.svg'

/*react-toastify*/
import 'react-toastify/dist/ReactToastify.css';
import { Slide, toast } from 'react-toastify'

/*components*/
import OptionDropdown, { DropDownActions, DropdownOwner } from "../dropDown/OptionDropdown.tsx"
import BlurBackground from "../dialogs/BlurBackground.tsx"
import RenameDialog from "../dialogs/RenameDialog.tsx"
import DeleteDialog from "../dialogs/DeleteDialog.tsx"
import AccessDialog from "../dialogs/accessDialog/AccessDialog.tsx"
import DescriptionDialog from "../dialogs/DescriptionDialog.tsx"
import MoveModelDialog from '../dialogs/moveModelDialog/MoveModelDialog.tsx'
import StatusDialog from '../dialogs/StatusDialog.tsx';

/*redux*/
import dirModelThunk from '../../../store/dirModel/dirModelThunk.ts'
import bpmnThunk from '../../../store/bpmn/bpmnThunk.ts'
import moveFeatureThunk from '../../../store/moveFeature/moveFeatureThunk.ts'
import { cancelMoving } from '../../../store/moveFeature/moveFeatureSlice.ts'
import { useAppDispatch, useAppSelector } from '../../../store'

/*extra*/
import { ModelMetadata } from "../../../models/model.ts"
import { DialogOwner } from "../dialogs/dialogOwner.ts"
import { DisplayStatus, Status } from '../../../models/enum.ts';



type Option = {
    type: DropDownActions,
    action: () => void
}

const ModelCard = ({ modelMetadata }: { modelMetadata: ModelMetadata }) => {
    const canEdit = useAppSelector(state => state.user.hasEditRight);
    const currentInode = useAppSelector(state => state.dirModel.currentInode)
    const [activeDialog, setActiveDialog] = useState<DropDownActions | null>(null);
    const dispatch = useAppDispatch();

    const closeDialog = useCallback<() => void>(() => setActiveDialog(null), []);

    const options: Option[] = useMemo<Option[]>(() => {
        let value = [
            {
                type: DropDownActions.STATUS_AENDERN,
                action: () => setActiveDialog(DropDownActions.STATUS_AENDERN)
            },
            {
                type: DropDownActions.UMBENENNEN,
                action: () => setActiveDialog(DropDownActions.UMBENENNEN),
            },
            {
                type: DropDownActions.BESCHREIBUNG,
                action: () => setActiveDialog(DropDownActions.BESCHREIBUNG),
            },
            {
                type: DropDownActions.ZUGREIFF_BEARBEITEN,
                action: () => setActiveDialog(DropDownActions.ZUGREIFF_BEARBEITEN),
            },
            {
                type: DropDownActions.LOESCHEN,
                action: () => setActiveDialog(DropDownActions.LOESCHEN),
            }
        ]

        if (currentInode! >= 0) {
            value.push({
                type: DropDownActions.VERSCHIEBEN,
                action: () => {
                    dispatch(moveFeatureThunk.loadCurrentDirectory({})),
                        setActiveDialog(DropDownActions.VERSCHIEBEN)
                }
            })
        }

        return value
    }, [currentInode]);

    const Dialog = () => {
        const targetDirForMoving = useAppSelector(state => state.moveFeature);
        const currentDir = useAppSelector(state => state.dirModel)

        const handleRename = (newName: string) => () => {
            const usedNamesForModels = Object.values(currentDir.containedModels).map(model => model.name);

            if (usedNamesForModels.includes(newName)) {
                toast.error(`Dieser Name ist schon benutzt in diesem Ordner!`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    closeOnClick: true,
                    progress: undefined,
                    theme: "colored",
                    toastId: "toast-rename-error",
                    containerId: "app-toast",
                    transition: Slide,
                })
                return
            }

            dispatch(dirModelThunk.renameModel({
                id: modelMetadata.id,
                name: newName
            }))

            closeDialog();
        }

        const handleDelete = () => {
            dispatch(dirModelThunk.deleteModel(modelMetadata.id))
            closeDialog();
        }

        const handleGrantAccess = (user: string, clearInput: () => void) => () => {
            if (modelMetadata.sharedReaders.includes(user)) {
                console.error(`User "${user}" has already access to this model`);
                return
            }

            dispatch(dirModelThunk.grantAccessToModel({
                modelId: modelMetadata.id,
                readerMail: user
            }))
            clearInput();
        }

        const handleRevokeAccess = (user: string) => () => {
            dispatch(dirModelThunk.revokeAccessToModel({
                modelId: modelMetadata.id,
                readerMail: user
            }))
        }

        const handleChangeDesc = (newDescription: string) => () => {
            dispatch(dirModelThunk.updateDescriptionModel({
                id: modelMetadata.id,
                description: newDescription
            }))
            closeDialog();
        }

        const handleMoveModel = () => {
            if (currentDir.currentInode === targetDirForMoving.destination_inode) return

            const usedNamesForModels = Object.values(targetDirForMoving.containedModels).map(model => model.name)
            if (usedNamesForModels.includes(modelMetadata.name)) {
                closeDialog();
                toast.error(`Dieser Name ist schon benutzt in  Zielordner!`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    progress: undefined,
                    theme: "colored",
                    toastId: "toast-move-rename",
                    containerId: "app-toast",
                    transition: Slide,
                })
                return
            }


            dispatch(moveFeatureThunk.moveModel(modelMetadata.id))

            toast(
                <div style={{
                    textAlign: "center",
                    color: "#131E36"
                }}>
                    <u><b>Gehen zum neuen Ordner</b></u>
                </div>, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                progress: undefined,
                theme: "colored",
                containerId: "app-toast",
                toastId: "toast-move-success",
                onClick: () => dispatch(dirModelThunk.changeDirAfterMovingModel()),
                onClose: () => dispatch(cancelMoving()),
                transition: Slide,
            })
            closeDialog();
        }

        const handleCancelMovingModel = () => {
            dispatch(cancelMoving())
            closeDialog()
        }

        const handleChangeStatus = (status: Status) => () => {
            if (status !== modelMetadata.status) {
                dispatch(dirModelThunk.updateStatusModel({
                    modelId: modelMetadata.id,
                    status
                }))
            }
            closeDialog()
        }

        switch (activeDialog) {
            case DropDownActions.UMBENENNEN:
                return <RenameDialog
                    dialogOwner={DialogOwner.MODEL}
                    currentName={modelMetadata.name}
                    handleSubmit={handleRename}
                    closeDialog={closeDialog} />;
            case DropDownActions.LOESCHEN:
                return <DeleteDialog
                    dialogOwner={DialogOwner.MODEL}
                    handleSubmit={handleDelete}
                    closeDialog={closeDialog} />;
            case DropDownActions.BESCHREIBUNG:
                return <DescriptionDialog
                    currentDescription={modelMetadata.description}
                    handleSubmit={handleChangeDesc}
                    closeDialog={closeDialog} />;
            case DropDownActions.ZUGREIFF_BEARBEITEN:
                return <AccessDialog
                    users={modelMetadata.sharedReaders}
                    closeDialog={closeDialog}
                    handleAdd={handleGrantAccess}
                    handleRemove={handleRevokeAccess} />;
            case DropDownActions.VERSCHIEBEN:
                return <MoveModelDialog
                    closeDialog={handleCancelMovingModel}
                    handleMove={handleMoveModel} />
            case DropDownActions.STATUS_AENDERN:
                return <StatusDialog
                    initialValue={modelMetadata.status}
                    closeDialog={closeDialog}
                    handleSubmit={handleChangeStatus}
                />
            default:
                return null
        }
    }


    const handleLike = (event: React.MouseEvent) => {
        event.stopPropagation();

        dispatch(dirModelThunk.changeModelFavorite(modelMetadata.id))
    };


    const handleOpenDiagram = () => {
        dispatch(bpmnThunk.loadModelById(modelMetadata.id))
    }

    return (
        <>
            <div className="model__container container"
                onClick={handleOpenDiagram}>
                <div className="container-inner">
                    <div className="model__container-left container-left">
                        <div className="model__container-heading container-heading">
                            <img className='icon' src={modelIcon} alt='file icon'/>
                            <div className='container-heading-info'>
                                <h3 className="name">{modelMetadata.name}</h3>
                                <p className="model__description">{modelMetadata.description}</p>
                            </div>
                        </div>

                        <div className="container-info">
                            <div className='author'>
                                <p className='label'>Autor/in:</p>
                                <p className='value'>{modelMetadata.author}</p>
                            </div>
                            <div className='date'>
                                <p className='label'>Datum:</p>
                                <p className='value'>{modelMetadata.creationDate}</p>
                            </div>
                            <div className='status'>
                                <p className='label'>Status:</p>
                                <p className='value'>{DisplayStatus[modelMetadata.status as keyof typeof DisplayStatus]}</p>
                            </div>
                        </div>
                    </div>

                    <div className="model__container-right container-right">
                        <button className='like-button' onClick={handleLike}>
                            <HeartIcon fill={modelMetadata.favorite ? '#7BC297' : "none"}/>
                        </button>
                        {
                            canEdit ?
                                <OptionDropdown options={options} cardType={DropdownOwner.MODEL}/>
                                : null
                        }
                    </div>
                </div>

            </div>
            {
                activeDialog && createPortal(
                    <BlurBackground handleOutsideClick={closeDialog}>
                        <Dialog/>
                    </BlurBackground>,
                    document.body
                )
            }
        </>
    )
}

export default ModelCard;