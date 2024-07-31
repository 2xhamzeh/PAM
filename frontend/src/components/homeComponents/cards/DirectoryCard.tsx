/*react*/
import { createPortal } from "react-dom"
import { useCallback, useMemo, useState } from "react"

/*components*/
import OptionDropdown, { DropDownActions, DropdownOwner } from "../dropDown/OptionDropdown.tsx"
import RenameDialog from "../dialogs/RenameDialog.tsx"
import BlurBackground from "../dialogs/BlurBackground.tsx"
import DeleteDialog from "../dialogs/DeleteDialog.tsx"

/*style*/
import './globalCard.scss'

/*extra*/
import { DirMetadata } from "../../../models/model.ts"
import { DialogOwner } from "../dialogs/dialogOwner.ts"

/*icons*/
import folderIcon from '../../../static/images/iconsFolder/folder.svg'

/*redux*/
import { useAppDispatch, useAppSelector } from '../../../store'
import dirModelThunk from '../../../store/dirModel/dirModelThunk.ts'

type Option = {
    type: DropDownActions,
    action: () => void,
}

const DirectoryCard = ({ dirMetadata }: { dirMetadata: DirMetadata }) => {
    const dispatch = useAppDispatch();
    const canEdit = useAppSelector(state => state.user.hasEditRight);
    const [activeDialog, setActiveDialog] = useState<DropDownActions | null>(null);

    const options: Option[] = useMemo<Option[]>(() => [
        {
            type: DropDownActions.UMBENENNEN,
            action: () => setActiveDialog(DropDownActions.UMBENENNEN),
        },
        {
            type: DropDownActions.LOESCHEN,
            action: () => setActiveDialog(DropDownActions.LOESCHEN),
        }
    ], []);

    const closeDialog = useCallback<() => void>(() => setActiveDialog(null), [])

    const Dialog = () => {
        if (!activeDialog) return;

        const handleRename = (name: string) => () => {
            dispatch(dirModelThunk.renameDirectory({ inode: dirMetadata.inode, name }))
            closeDialog();
        }

        const handleDelete = () => {
            dispatch(dirModelThunk.deleteDirectory(dirMetadata.inode))
            closeDialog();
        }

        switch (activeDialog) {
            case DropDownActions.UMBENENNEN:
                return <RenameDialog
                    dialogOwner={DialogOwner.DIRECTORY}
                    currentName={dirMetadata.name}
                    handleSubmit={handleRename}
                    closeDialog={closeDialog} />
            case DropDownActions.LOESCHEN:
                return <DeleteDialog
                    dialogOwner={DialogOwner.DIRECTORY}
                    handleSubmit={handleDelete}
                    closeDialog={closeDialog} />;
        }
    }

    const handleNavigate = () => {
        dispatch(dirModelThunk.loadDirectoryByInode(dirMetadata.inode))
    }

    return (

        <>
            <div className="folder__container container" onClick={handleNavigate}>
                <div className="container-inner">
                    <div className="container-left">
                        <div className="container-heading">
                            <img className='icon' src={folderIcon} alt='folder icon'/>
                            <h3 className="name">{dirMetadata.name}</h3>
                        </div>
                    </div>

                    <div className="folder__container-right container-right">
                        {
                            canEdit ?
                                <OptionDropdown options={options} cardType={DropdownOwner.DIRECTORY}/>
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

export default DirectoryCard;